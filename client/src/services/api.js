import axios from 'axios';

// Create Axios client with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local storage
      const token = localStorage.getItem('skillbridge_token');
      if (token && window.location.pathname !== '/login') {
        localStorage.removeItem('skillbridge_token');
        localStorage.removeItem('skillbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   API Service Methods
   ========================================================================== */

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// User Profile Services
export const userService = {
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  searchUsers: (params) => api.get('/users/search', { params }),
};

// Project Services
export const projectService = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getMyProjects: () => api.get('/projects/my-projects'),
  getJoinedProjects: () => api.get('/projects/joined'),
};

// Collaboration Request Services
export const requestService = {
  sendRequest: (requestData) => api.post('/requests', requestData),
  getSentRequests: () => api.get('/requests/sent'),
  getReceivedRequests: () => api.get('/requests/received'),
  acceptRequest: (id) => api.put(`/requests/${id}/accept`),
  rejectRequest: (id) => api.put(`/requests/${id}/reject`),
};

export default api;
