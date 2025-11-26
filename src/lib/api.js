import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global auth error handling: if token is invalid/expired, send user back to sign in
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // Clear any stored auth state
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      // Avoid infinite redirect loop if we're already on the sign-in page
      if (!window.location.pathname.startsWith('/signin')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export const platformAPI = {
  getSchools: () => api.get('/api/platform/schools').then(r => r.data),
  getSchoolDetails: (schoolId) => api.get(`/api/platform/schools/${schoolId}`).then(r => r.data),
  createSchool: (name, contactInfo, accountStatus, subscriptionTier) => api.post('/api/platform/schools', null, { params: { name, contact_info: contactInfo, account_status: accountStatus, subscription_tier: subscriptionTier } }).then(r => r.data),
  updateSchoolStatus: (schoolId, status) => api.put(`/api/platform/schools/${schoolId}/status`, null, { params: { status } }).then(r => r.data),
  getAllPayments: (status) => api.get('/api/platform/payments', { params: status ? { status } : {} }).then(r => r.data),
  adjustPayment: (paymentId, amount, notes) => api.post(`/api/platform/payments/${paymentId}/adjust`, null, { params: { adjustment_amount: amount, notes } }).then(r => r.data),
  refundPayment: (paymentId, amount) => api.post(`/api/platform/payments/${paymentId}/refund`, null, { params: amount ? { refund_amount: amount } : {} }).then(r => r.data),
  getSchoolFeatures: (schoolId) => api.get(`/api/platform/features/${schoolId}`).then(r => r.data),
  setFeatureFlag: (schoolId, feature) => api.post(`/api/platform/features/${schoolId}`, feature).then(r => r.data),
  getDashboard: () => api.get('/api/platform/dashboard').then(r => r.data),
};

export default api;

