import axios from 'axios';

console.log('API URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Adiciona o token de autenticação em todas as requisições, exceto login
api.interceptors.request.use(config => {
  // Não adiciona Authorization se for login
  if (config.url && config.url.includes('/api/login/')) {
    return config;
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
 
export default api; 