import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addClick, findByCode } from './services/storage'
import { logEvent } from './services/logger'

export default function UrlRedirect() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const item = findByCode(code)
    if (!item) {
      navigate('/', { replace: true })
      return
    }
    if (Date.now() > item.expireAt) {
      alert('This link has expired.')
      navigate('/', { replace: true })
      return
    }
    try {
      const meta = {
        source: document.referrer || 'direct',
        locale: navigator.language || 'unknown',
      }
      addClick(code, meta)
      logEvent('short_link_click', { code, ...meta })
    } catch {}
    window.location.replace(item.longUrl)
  }, [code, navigate])

  return <div>Redirecting...</div>
}


