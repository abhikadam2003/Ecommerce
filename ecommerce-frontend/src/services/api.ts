import axios from 'axios';
import { ApiResponse, LoginCredentials, RegisterCredentials, Product, Category, CartItem, Order, ProductFilters } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (credentials: RegisterCredentials) =>
    api.post<ApiResponse<{ id: string; name: string; email: string; role: string } & { token: string }>>('/auth/register', credentials),
  
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<{ id: string; name: string; email: string; role: string } & { token: string }>>('/auth/login', credentials),
  
  me: () => api.get<ApiResponse<{ id: string; name: string; email: string; role: string }>>('/auth/me'),
  
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
};

export const productAPI = {
  getProducts: (filters?: ProductFilters) =>
    api.get<ApiResponse<Product[]>>('/products', { params: filters }),
  
  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),
  
  createProduct: (product: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/products', product),
  
  updateProduct: (id: string, product: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, product),
  
  deleteProduct: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/products/${id}`),
};

export const categoryAPI = {
  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/categories'),
  
  getCategory: (id: string) =>
    api.get<ApiResponse<Category>>(`/categories/${id}`),
  
  createCategory: (category: { name: string }) =>
    api.post<ApiResponse<Category>>('/categories', category),
  
  updateCategory: (id: string, category: { name: string }) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, category),
  
  deleteCategory: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/categories/${id}`),
};

export const cartAPI = {
  getCart: () =>
    api.get<ApiResponse<CartItem[]>>('/cart'),
  
  addToCart: (productId: string, quantity: number = 1) =>
    api.post<ApiResponse<CartItem[]>>('/cart', { productId, quantity }),
  
  updateCartItem: (productId: string, quantity: number) =>
    api.put<ApiResponse<CartItem[]>>('/cart', { productId, quantity }),
  
  removeFromCart: (productId: string) =>
    api.delete<ApiResponse<CartItem[]>>(`/cart/${productId}`),
  
  getWishlist: () =>
    api.get<ApiResponse<Product[]>>('/cart/wishlist'),
  
  toggleWishlist: (productId: string) =>
    api.post<ApiResponse<Product[]>>('/cart/wishlist', { productId }),
};

export const orderAPI = {
  placeOrder: (shippingAddress: string) =>
    api.post<ApiResponse<Order>>('/orders', { shippingAddress }),
  
  getMyOrders: () =>
    api.get<ApiResponse<Order[]>>('/orders/me'),
  
  getAllOrders: () =>
    api.get<ApiResponse<Order[]>>('/orders'),
  
  updateOrderStatus: (id: string, status: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}`, { status }),
};

export default api;
