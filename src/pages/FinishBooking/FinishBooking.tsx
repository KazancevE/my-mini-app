import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import s from './finishBooking.module.scss'
// import s from './styles.module.css';
const FinishBooking: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/')
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Спасибо за ваше бронирование!</h1>
      <span className={s.message}>
        Благодарим вас за доверие. Мы рады, что вы выбрали наш сервис.
      </span>
      <Button 
        text='ПЕРЕЙТИ К БРОНИРОВАНИЮ' 
        onClick={handleReturnHome} 
        className='button'
      />
    </div>
  );
};

// // Стили для компонента
// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100vh',
//     textAlign: 'center',
//   },
// };

export default FinishBooking;
