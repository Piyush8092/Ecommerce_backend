import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Backend API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add token to requests (both header and cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    // Send token in Authorization header
    config.headers.Authorization = `Bearer ${token}`;

    // Also send token as cookie
    document.cookie = `adminToken=${token}; path=/; SameSite=Lax`;
  }
  return config;
});

// Helper function to normalize API responses
const normalizeResponse = (response) => {
  let data = response.data;

  // If data is an object but not an array, try to find the array property
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Try common property names
    data = data.data || data.items || data.results || data.carousels || data.carsole || [];
  }

  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
};

// API calls for Users
export const userAPI = {
  getAll: () => api.get('/adminAllUserView'),
  getById: (id) => api.get(`/AdminSpecificUserView/${id}`),
  updateRole: (id, data) => api.put(`/AdminRoleUpdate/${id}`, data),
  delete: (id) => api.delete(`/deleteUser/${id}`),
  query: (params) => api.get('/queryAdminUser', { params }),
};

// API calls for Products
export const productAPI = {
  getAll: () => api.get('/getAllProduct'),
  getById: (id) => api.get(`/getSpecificProduct/${id}`),
  create: (data) => api.post('/createProduct', data),
  update: (id, data) => api.put(`/updateProduct/${id}`, data),
  delete: (id) => api.delete(`/deleteProduct/${id}`),
  query: (params) => api.get('/queryProduct', { params }),
};

// API calls for Carousel
export const carouselAPI = {
  getAll: () => api.get('/getAllCarsole'),
  getById: (id) => api.get(`/getSpecificCarsole/${id}`),
  create: (data) => api.post('/createCarsole', data),
  update: (id, data) => api.put(`/updateCarsole/${id}`, data),
  delete: (id) => api.delete(`/deleteCarsole/${id}`),
};

// API calls for Orders
export const orderAPI = {
  getAll: () => api.get('/getLoginUserOrder'),
  getPending: () => api.get('/getAllPendingOrder'),
  getAccepted: () => api.get('/getAllAcceptedOrder'),
  getShipped: () => api.get('/getAllShiftedOrder'),
  getCancelled: () => api.get('/getAllCancelOrder'),
  create: (data) => api.post('/createOrder', data),
  updateStatus: (id, data) => api.put(`/updateOrderStatusByManneger/${id}`, data),
  update: (id, data) => api.put(`/updateOrder/${id}`, data),
};

// API calls for Blogs
export const blogAPI = {
  getAll: () => api.get('/getAllBlog'),
  getById: (id) => api.get(`/getSpecificBlog/${id}`),
  create: (data) => api.post('/createBlog', data),
  update: (id, data) => api.put(`/updateBlog/${id}`, data),
  delete: (id) => api.delete(`/deleteBlog/${id}`),
  query: (params) => api.get('/queryBlog', { params }),
};

// API calls for Contact
export const contactAPI = {
  getAll: () => api.get('/getContact'),
  getById: (id) => api.get(`/getSpecificContact/${id}`),
  create: (data) => api.post('/createContact', data),
  update: (id, data) => api.put(`/updateContact/${id}`, data),
  delete: (id) => api.delete(`/deleteContact/${id}`),
  query: (params) => api.get('/queryContact', { params }),
};

// API calls for Delivery Address
export const deliveryAddressAPI = {
  getAll: () => api.get('/getAllDeliveryAdderss'),
  getById: (id) => api.get(`/getSpecificUserAddrressMannegerAndEmployeView/${id}`),
  create: (data) => api.post('/createDeliveryAddress', data),
  update: (id, data) => api.put(`/updateAddress/${id}`, data),
  delete: (id) => api.delete(`/deleteDeliveryAddress/${id}`),
};

// API calls for Cart
export const cartAPI = {
  getAll: () => api.get('/getAllCart'),
  create: (data) => api.post('/createCart', data),
  update: (id, data) => api.put(`/updateCart/${id}`, data),
  delete: (id) => api.delete(`/deleteCart/${id}`),
};

// API calls for Payments
export const paymentAPI = {
  getAll: () => api.get('/getAllPaymentAdminView'),
  getPending: () => api.get('/getAllFaildPayment'),
  getSuccessful: () => api.get('/getAllSuccessPayment'),
  getById: (id) => api.get(`/getSpecificPayment/${id}`),
  create: (data) => api.post('/createPayment', data),
  update: (id, data) => api.put(`/updatePayment/${id}`, data),
  delete: (id) => api.delete(`/deletePayment/${id}`),
};

export { normalizeResponse };
export default api;

