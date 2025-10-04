import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth-token') || localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})
// Always send cookies so /auth/me works if backend uses cookies
api.defaults.withCredentials = true

export async function fetchProducts(params = {}) {
  const response = await api.get('/products', { params })
  return response.data
}

export async function fetchProductById(productId) {
  const response = await api.get(`/products/${productId}`)
  return response.data
}

export async function authenticate(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function getMe() {
  const response = await api.get('/auth/me')
  return response.data
}

export async function getCart() {
  const response = await api.get('/cart')
  return response.data
}

export async function addToCart(productId, quantity = 1) {
  const response = await api.post('/cart', { productId, quantity })
  return response.data
}

export async function removeFromCart(productId) {
  const response = await api.delete(`/cart/${productId}`)
  return response.data
}

export async function createProduct(product) {
  const response = await api.post('/products', product)
  return response.data
}


