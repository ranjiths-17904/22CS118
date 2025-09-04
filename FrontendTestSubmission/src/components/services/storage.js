const STORAGE_KEY = 'url_shortener_links_v1'

export function generateCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function loadLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveLinks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function isValidUrl(value) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function upsertLink({ longUrl, minutes, code }) {
  const now = Date.now()
  const durationMs = (Number.isInteger(minutes) && minutes > 0 ? minutes : 30) * 60 * 1000
  const list = loadLinks()

  let finalCode = code && /^[a-zA-Z0-9]+$/.test(code) ? code : undefined
  if (!finalCode) {
    do {
      finalCode = generateCode(7)
    } while (list.some((l) => l.code === finalCode))
  } else if (list.some((l) => l.code === finalCode)) {
    throw new Error('Shortcode already in use')
  }

  const item = {
    code: finalCode,
    longUrl,
    createdAt: now,
    expireAt: now + durationMs,
    clicks: [],
  }
  list.push(item)
  saveLinks(list)
  return item
}

export function findByCode(code) {
  return loadLinks().find((l) => l.code === code)
}

export function addClick(code, meta) {
  const list = loadLinks()
  const idx = list.findIndex((l) => l.code === code)
  if (idx === -1) return
  list[idx].clicks.push({ at: Date.now(), ...meta })
  saveLinks(list)
}

export function purgeExpired() {
  const now = Date.now()
  const list = loadLinks().filter((l) => l.expireAt > now)
  saveLinks(list)
  return list
}

export function getAll() {
  return purgeExpired()
}


