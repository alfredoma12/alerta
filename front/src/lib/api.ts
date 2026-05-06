import axios from 'axios'

const API = 'https://tuesday-reproach-crestless.ngrok-free.dev'

export const api = axios.create({
  baseURL: API,
})

