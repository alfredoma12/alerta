import axios from 'axios'

function getRuntimeApiUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_URL
  if (configuredUrl && configuredUrl.trim()) {
    return configuredUrl.trim()
  }

  const metaTag = document.querySelector('meta[name="api-url"]')
  const metaUrl = metaTag?.getAttribute('content')
  if (metaUrl && metaUrl.trim()) {
    return metaUrl.trim()
  }

  return 'http://localhost:3000'
}

const API = getRuntimeApiUrl()

console.log('[api] baseURL =', API)

export const api = axios.create({
  baseURL: API,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

