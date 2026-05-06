import axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const api = axios.create({
  baseURL: API,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

