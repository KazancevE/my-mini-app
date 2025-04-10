import axios from 'axios';

// 1. Получаем URL API из переменных окружения с проверкой
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  console.error('REACT_APP_API_URL is not defined in environment variables');
  throw new Error('API URL is not configured');
}

// 2. Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async login(initData: string) {
    try {
      console.log('Sending auth request to:', `${API_URL}/auth/validate_data/`);
      
      const response = await apiClient.post(
        '/auth/validate_data/',
        { init_data: initData },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      console.log('Auth response received');
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        url: `${API_URL}/auth/validate_data/`,
        error: axios.isAxiosError(error) ? {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config
        } : error
      });
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) throw new Error('No refresh token found');
      
      const response = await apiClient.post(
        '/auth/refresh', 
        { refresh_token },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      localStorage.setItem('access_token', response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// 3. Интерцептор запросов
apiClient.interceptors.request.use(config => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Для отладки
  console.log(`Requesting: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// 4. Интерцептор ответов
apiClient.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  async error => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    }

    // Обработка 401 ошибки
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        console.log('Attempting token refresh...');
        await authService.refreshToken();
        return apiClient(error.config);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        authService.clearAuthData();
        window.location.href = '/login'; // Перенаправление на страницу входа
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;