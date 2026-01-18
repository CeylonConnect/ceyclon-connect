import axios from 'axios'

// Configure base URL. You can set VITE_API_BASE_URL in a .env file.
// Fallback to common local backend path.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL,
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
