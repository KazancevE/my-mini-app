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

  const initializeWebApp = useCallback(() => {
    WebApp.ready();
    WebApp.enableClosingConfirmation();
    WebApp.setHeaderColor('#333232');
    WebApp.setBackgroundColor('#333232');
  }, []);

  const handleViewportChange = useCallback(() => {
    if (!WebApp.isExpanded) {
      WebApp.expand();
    }
  }, []);

  const handleAuthError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка авторизации';
    console.error('Auth error:', error);
    setAuthError(errorMessage);
    WebApp.showAlert(errorMessage, () => WebApp.close());
  }, []);

  const authenticateUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      if (!WebApp.initData) {
        throw new Error('Данные авторизации Telegram не предоставлены');
      }

      if (!WebApp.initDataUnsafe?.user?.id) {
        throw new Error('Неверные данные пользователя Telegram');
      }

      await login(WebApp.initData);
      WebApp.HapticFeedback.notificationOccurred('success');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [login, handleAuthError]);

  useEffect(() => {
    initializeWebApp();
    
    WebApp.onEvent('viewportChanged', handleViewportChange);
    handleViewportChange();

    authenticateUser();

    return () => {
      WebApp.offEvent('viewportChanged', handleViewportChange);
    };
  }, [initializeWebApp, handleViewportChange, authenticateUser]);

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
              <p>Пожалуйста, откройте приложение через Telegram</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;