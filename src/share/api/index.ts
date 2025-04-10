import axios from 'axios';

const API_URL = process.env.BASE_URL

export const authService = {
  async login(initData: string) {
    const response = await axios.post(`${API_URL}/auth/telegram`, { initData });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
};

// Интерцептор для добавления токена к запросам
axios.interceptors.request.use(config => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки 401 ошибки
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await authService.refreshToken();
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);