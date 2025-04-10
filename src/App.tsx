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
    WebApp.enableClosingConfirmation(); // Включить подтверждение закрытия
    WebApp.setHeaderColor('#333232');   // Другие настройки
    WebApp.expand(); 
    if (WebApp.initData) {
      login(WebApp.initData).catch(console.error);
    } 
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