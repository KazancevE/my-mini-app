import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import './App.scss';
import './style.scss';
import Booking from './pages/Booking/Booking';
import BookingTable from './pages/BookingTable/BookingTable';
import ConfirmTable from './pages/ConfirmTable/ConfirmTable';
import FinishBooking from './pages/FinishBooking/FinishBooking';
import WebApp from '@twa-dev/sdk';
import { useAuth } from './share/AuthProvider';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

const App: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isTelegramEnv, setIsTelegramEnv] = useState(true);

  // Инициализация WebApp
  const initializeWebApp = useCallback(() => {
    try {
      WebApp.ready();
      WebApp.enableClosingConfirmation();
      WebApp.setHeaderColor('#333232');
      WebApp.setBackgroundColor('#333232');
      
      // Проверяем, что мы в Telegram WebApp
      if (!window.Telegram?.WebApp) {
        setIsTelegramEnv(false);
        throw new Error('Not in Telegram environment');
      }
    } catch (error) {
      console.error('WebApp initialization error:', error);
      setIsTelegramEnv(false);
    }
  }, []);

  // Обработчик изменений viewport
  const handleViewportChange = useCallback(() => {
    if (isTelegramEnv && !WebApp.isExpanded) {
      WebApp.expand();
    }
  }, [isTelegramEnv]);

  // Аутентификация пользователя
  const authenticateUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      if (!isTelegramEnv) return;

      // Проверка данных авторизации
      if (!WebApp.initData || !WebApp.initData.includes('hash=')) {
        const errorMessage = WebApp.initData 
          ? 'Invalid Telegram auth data format' 
          : 'Telegram auth data not provided';
        throw new Error(errorMessage);
      }

      console.log('Telegram initData:', {
        length: WebApp.initData.length,
        firstChars: WebApp.initData.substring(0, 30) + '...'
      });

      await login(WebApp.initData);
      console.log('Auth successful, user:', WebApp.initDataUnsafe?.user);
      
      if (isTelegramEnv) {
        WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setAuthError(errorMessage);
      
      if (isTelegramEnv) {
        WebApp.showAlert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isTelegramEnv, login]);

  useEffect(() => {
    initializeWebApp();

    if (isTelegramEnv) {
      WebApp.onEvent('viewportChanged', handleViewportChange);
      handleViewportChange();
    }

    authenticateUser();

    return () => {
      if (isTelegramEnv) {
        WebApp.offEvent('viewportChanged', handleViewportChange);
      }
    };
  }, [initializeWebApp, handleViewportChange, authenticateUser, isTelegramEnv]);

  // Рендер состояния загрузки
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Рендер ошибки вне Telegram
  if (!isTelegramEnv) {
    return (
      <div className="telegram-required">
        <h1>Это Telegram Mini App</h1>
        <p>Пожалуйста, откройте приложение через Telegram</p>
        <button onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
      </div>
    );
  }

  // Рендер ошибки авторизации
  if (authError) {
    return (
      <div className="error-container">
        <h1>Ошибка авторизации</h1>
        <p>{authError}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  // Рендер защищенных маршрутов
  const renderProtectedRoute = (element: React.ReactNode) => (
    isAuthenticated ? element : <Navigate to="/error" />
  );

  return (
    <Router>
      <div className='app'>
        <Header />
        <Routes>
          <Route path="/" element={renderProtectedRoute(<Home />)} />
          <Route path="/booking" element={renderProtectedRoute(<Booking />)} />
          <Route path="/tables" element={renderProtectedRoute(<BookingTable />)} />
          <Route path="/confirmation" element={renderProtectedRoute(<ConfirmTable />)} />
          <Route path="/finishbooking" element={renderProtectedRoute(<FinishBooking />)} />
          <Route path="/error" element={
            <div className="auth-error">
              <h1>Требуется авторизация</h1>
              <p>Пожалуйста, войдите через Telegram</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;