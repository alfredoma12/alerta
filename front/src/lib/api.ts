import axios from 'axios'

const configuredApiUrl = import.meta.env.VITE_API_URL
const configuredApiKey = import.meta.env.VITE_API_KEY
const isProd = import.meta.env.PROD
const apiBaseUrl = configuredApiUrl || 'http://localhost:3001'

if (isProd && !configuredApiUrl) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL no esta configurado en produccion. Configura la URL publica del tunnel de Cloudflare.')
}

if (!configuredApiKey) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_KEY no esta configurado. El backend respondera 403 hasta que definas una API key publica para el frontend.')
}

export const api = axios.create({
  baseURL: apiBaseUrl,
})

api.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  config.headers['x-api-key'] = configuredApiKey || ''
  return config
})

export function setAuthToken(token: string | null) {
  if (!token) {
    delete api.defaults.headers.common.Authorization
    return
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`
}
