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

  // Обработчик изменений viewport
  const handleViewportChange = useCallback(() => {
    if (!WebApp.isExpanded) {
      WebApp.expand();
    }
  }, []);

  useEffect(() => {
    // 1. Инициализация WebApp
    WebApp.ready();
    console.log('WebApp environment:', {
      platform: WebApp.platform,
      version: WebApp.version,
      initData: WebApp.initData ? 'exists' : 'empty',
      user: WebApp.initDataUnsafe?.user
    });

    // 2. Настройка поведения приложения
    WebApp.enableClosingConfirmation();
    WebApp.setHeaderColor('#333232');
    WebApp.setBackgroundColor('#333232');
    
    // 3. Добавляем обработчик viewport
    WebApp.onEvent('viewportChanged', handleViewportChange);
    handleViewportChange(); // Вызываем сразу для начального состояния

    // 4. Авторизация через initData
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);

        if (!WebApp.initData) {
          throw new Error('Telegram auth data not provided');
        }

        if (!WebApp.initDataUnsafe?.user?.id) {
          throw new Error('Invalid Telegram user data');
        }

        await login(WebApp.initData);
        console.log('Auth successful, user:', WebApp.initDataUnsafe.user);
        WebApp.HapticFeedback.notificationOccurred('success');
      } catch (error) {
        console.error('Auth error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown auth error';
        setAuthError(errorMessage);
        WebApp.showAlert(`Ошибка авторизации: ${errorMessage}`, () => {
          WebApp.close();
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      WebApp.offEvent('viewportChanged', handleViewportChange);
    };
  }, [login, handleViewportChange]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (authError) {
    return (
      <div className="error-container">
        <h1>Ошибка авторизации</h1>
        <p>{authError}</p>
        <p>Пожалуйста, откройте приложение через Telegram</p>
      </div>
    );
  }

  return (
    <Router>
      <div className='app'>
        <Header />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/error" />} />
          <Route path="/booking" element={isAuthenticated ? <Booking /> : <Navigate to="/error" />} />
          <Route path="/tables" element={isAuthenticated ? <BookingTable /> : <Navigate to="/error" />} />
          <Route path="/confirmation" element={isAuthenticated ? <ConfirmTable /> : <Navigate to="/error" />} />
          <Route path="/finishbooking" element={isAuthenticated ? <FinishBooking /> : <Navigate to="/error" />} />
          <Route path="/error" element={
            <div className="auth-error">
              <h1>Требуется авторизация</h1>
              <p>Пожалуйста, откройте приложение через Telegram</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;