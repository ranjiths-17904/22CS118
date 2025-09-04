// Simple client logging middleware replacement: collects logs and prints once
const LOGS_KEY = 'client_logs_v1'

export function logEvent(event, payload = {}) {
  const entry = { t: Date.now(), event, payload }
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    const list = raw ? JSON.parse(raw) : []
    list.push(entry)
    localStorage.setItem(LOGS_KEY, JSON.stringify(list))
  } catch {}
}

export function getLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}


