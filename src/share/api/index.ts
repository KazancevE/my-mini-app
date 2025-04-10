import axios from 'axios';

const API_URL = process.env.BASE_URL;

export const authService = {
    async login(initData: string) {
        const response = await axios.post(
          `${API_URL}/auth/validate_data/`, // Обратите внимание на слэш в конце
          {
            init_data: initData // Ключ должен быть "init_data", а не "initData"
          },
          {
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        return response.data;
      },

  async refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    const response = await axios.post(`${API_URL}/auth/refresh`, { refresh_token });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  }
};

// Базовые заголовки для всех запросов
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Интерцептор для добавления токена к запросам
axios.interceptors.request.use(config => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Убедимся, что заголовок Accept установлен
  config.headers.Accept = 'application/json';
  
  return config;
});

// Интерцептор для обработки 401 ошибки
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await authService.refreshToken();
        return axios(error.config);
      } catch (refreshError) {
        // Очистка хранилища при неудачном обновлении токена
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload(); // или перенаправление на страницу входа
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);