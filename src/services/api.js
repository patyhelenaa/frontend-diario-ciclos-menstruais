import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ajuste para o endereço do backend no Docker depois
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