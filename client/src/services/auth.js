import api from './api'

// Assumed backend routes. Adjust to match your server.
export function login(email, password) {
  return api.post('/auth/login', { email, password })
}

export function signup(payload) {
  // payload should be snake_case for your backend:
  // { first_name, last_name, phone, email, password, role }
  return api.post('/auth/register', payload)
}
