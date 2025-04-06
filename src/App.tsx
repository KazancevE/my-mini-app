import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import './App.scss';
import './style.scss';
import Booking from './pages/Booking/Booking';
import BookingTable from './pages/BookingTable/BookingTable';
import ConfirmTable from './pages/ConfirmTable/ConfirmTable';
import FinishBooking from './pages/FinishBooking/FinishBooking';

const App: React.FC = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;