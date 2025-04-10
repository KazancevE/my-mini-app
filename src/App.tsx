import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const App: React.FC = () => {
  const { login, isAuthenticated  } = useAuth();
  useEffect(() => {
    // 1. Инициализация WebApp
    WebApp.ready();
    
    // 2. Настройка поведения приложения
    WebApp.enableClosingConfirmation();
    WebApp.setHeaderColor('#333232');
    WebApp.setBackgroundColor('#333232'); // Рекомендуется задать тот же цвет
    
    // 3. Обработка раскрытия на весь экран
    const handleViewportChange = () => {
      if (!WebApp.isExpanded) {
        WebApp.expand();
      }
    };
    
    WebApp.onEvent('viewportChanged', handleViewportChange);
    handleViewportChange(); // Вызываем сразу при инициализации
    
    // 4. Авторизация через initData
    const initAuth = async () => {
      try {
        if (WebApp.initData) {
          await login(WebApp.initData);
          console.log('Auth successful, user:', WebApp.initDataUnsafe.user);
        }
      } catch (error) {
        console.error('Auth error:', error);
        WebApp.showAlert('Ошибка авторизации');
      }
    };
    
    initAuth();
  
    return () => {
      WebApp.offEvent('viewportChanged', handleViewportChange);
    };
  }, [login]);

  
  return (
    <Router>
      {isAuthenticated ? (
        <div className='app'>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/tables" element={<BookingTable />} />
            <Route path="/confirmation" element={<ConfirmTable />} />
            <Route path="/finishbooking" element={<FinishBooking />} />
          </Routes>
        {/* <Footer /> */}
        </div>
      ) : (
        <h1>Зайдите через телеграмм</h1>
      )}
      
    </Router>
  );
};

export default App;