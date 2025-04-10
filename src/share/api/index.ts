import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosHeaders,
    RawAxiosRequestHeaders,
    HeadersDefaults
  } from 'axios';
  
  // 1. Конфигурация API
  const API_URL = process.env.REACT_APP_API_URL;
  if (!API_URL) {
    console.error('REACT_APP_API_URL is not defined');
    throw new Error('API URL is not configured');
  }
  
  // 2. Типы для ошибок
  interface ApiError<T = unknown, D = any> extends AxiosError<T, D> {
    config: InternalAxiosRequestConfig<D> & { _retry?: boolean };
  }
  
  // 3. Создание экземпляра axios с правильной типизацией заголовков
  const defaultHeaders: RawAxiosRequestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest'
  };
  
  const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: defaultHeaders
  });
  
  // 4. Проверка сетевых ошибок
  const isNetworkError = (error: unknown): error is ApiError => {
    const err = error as ApiError;
    return err.isAxiosError && 
           (err.code === 'ERR_NETWORK' || 
            err.message.includes('Network Error') ||
            (err.response?.status === 0 && !err.response?.data));
  };
  
  // 5. Сервис аутентификации
  export const authService = {
    async login(initData: string): Promise<{ access_token: string; refresh_token: string }> {
      try {
        if (!initData?.includes('hash=')) {
          throw new Error('Invalid initData format');
        }
  
        const response = await apiClient.post<{
          access_token: string;
          refresh_token: string;
        }>('/auth/validate_data/', { init_data: initData });
  
        if (!response.data?.access_token || !response.data?.refresh_token) {
          throw new Error('Invalid server response');
        }
  
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        return response.data;
      } catch (error) {
        if (isNetworkError(error)) {
          console.error('Network error:', error);
          throw new Error('Connection error. Please try again.');
        }
        console.error('Login error:', error);
        throw error;
      }
    },
  
    async refreshToken(): Promise<{ access_token: string }> {
      try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) {
          throw new Error('No refresh token available');
        }
  
        const response = await apiClient.post<{ access_token: string }>(
          '/auth/refresh', 
          { refresh_token }
        );
        
        if (!response.data?.access_token) {
          throw new Error('Invalid refresh response');
        }
  
        localStorage.setItem('access_token', response.data.access_token);
        return response.data;
      } catch (error) {
        this.clearAuthData();
        console.error('Refresh error:', error);
        throw error;
      }
    },
  
    getAccessToken(): string | null {
      return localStorage.getItem('access_token');
    },
  
    clearAuthData(): void {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };
  
  // 6. Интерцептор запросов с правильной типизацией заголовков
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authService.getAccessToken();
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: AxiosError) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
  
  // 7. Интерцептор ответов
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`Response from ${response.config.url}: ${response.status}`);
      return response;
    },
    async (error: ApiError) => {
      const originalRequest = error.config;
      
      if (!originalRequest) {
        return Promise.reject(error);
      }
  
      // Обработка 401 ошибки
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const { access_token } = await authService.refreshToken();
          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }
          originalRequest.headers.set('Authorization', `Bearer ${access_token}`);
          return apiClient(originalRequest);
        } catch (refreshError) {
          authService.clearAuthData();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default apiClient;