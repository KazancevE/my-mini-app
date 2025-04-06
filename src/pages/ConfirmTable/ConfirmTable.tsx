import Button from '../../components/Button/Button';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './confirmTable.scss'
import { useNavigate } from 'react-router-dom';

const ConfirmationPage: React.FC = () => {
  let tg = window.Telegram.WebApp;
  const location = useLocation();
  const { date, time, hours, guests, table } = location.state as any;
  const [comments, setComments] = useState("");
  const navigate = useNavigate();

  // Отдельные состояния для каждой опции
  const [isCocktailAdded, setIsCocktailAdded] = useState(false);
  const [isDrinksAdded, setIsDrinksAdded] = useState(false);
  const [isGamesAdded, setIsGamesAdded] = useState(false);

  const handleConfirm = () => {
    console.log("Booking confirmed:", { date, time, hours, guests, table, comments });
    const data = {
      date, 
      time, 
      hours, 
      guests, 
      table: location.state.table.id, 
      comments,
      preferences: {
        cocktail: isCocktailAdded,
        drinks: isDrinksAdded,
        games: isGamesAdded
      }
    }
    tg.sendData(JSON.stringify(data));
    tg.close();
    navigate('/finishbooking')
  };

  const guestDescription = (n: number): string => {
    if (n === 1) {
      return 'человек';
    } else if (n > 1 && n < 5) {
      return 'человека';
    } else {
      return 'Человек';
    }
  };

  console.log(location.state);

  return (
    <div className='container'>
      <div className='short_desccription'>
        <img src={table.image} alt={`Table ${table.id}`} />
        <div>
        <h4>19.05 Chill Space</h4>
        <p>{table.description}</p>
        <p>Стол №{table.id}</p>
        <p>{table.address}</p>
        </div>
      </div>
      <div className='line'></div>

      <div className='booking_description'>
        <h4>Ваше бронирование</h4>
        <h5>Дата: </h5> 
        <span>{date}</span>
        <h5>Время: </h5> 
        <span>{time}</span>
        <h5>Количество гостей: </h5> 
        <span>{guests} {guestDescription(guests)}</span>
      </div>

      <div className='line'></div>

      <div className='booking_description'>
        <h4>Пожелания к бронированию</h4>
        <div className='prefer'>
          <img src="" alt="logo" />
          <h5>Паровой коктейль</h5>
          <div 
            className={`toggleBtn ${isCocktailAdded ? 'added' : ''}`}
            onClick={() => setIsCocktailAdded(!isCocktailAdded)}
          >
            {isCocktailAdded ? 'Добавлено' : 'Добавить'}
          </div>
        </div>

        <div className='prefer'>
          <img src="" alt="logo" />
          <h5>Напитки</h5>
          <div 
            className={`toggleBtn ${isDrinksAdded ? 'added' : ''}`}
            onClick={() => setIsDrinksAdded(!isDrinksAdded)}
          >
            {isDrinksAdded ? 'Добавлено' : 'Добавить'}
          </div>
        </div>
        
        <div className='prefer'>
          <img src="" alt="logo" />
          <h5>Зарезервировать игры</h5>
          <div 
            className={`toggleBtn ${isGamesAdded ? 'added' : ''}`}
            onClick={() => setIsGamesAdded(!isGamesAdded)}
          >
            {isGamesAdded ? 'Добавлено' : 'Добавить'}
          </div>
        </div>
      </div>
      
      <span className='warning'>Нажимая "Подтвердить бронь", вы подтверждаете, что вам исполнилось 18 лет. Если вам нет 18 лет, бронирование невозможно.</span>
      <Button 
        text='ПЕРЕЙТИ К БРОНИРОВАНИЮ' 
        onClick={handleConfirm} 
        className='button'
      />
    </div>
  );
};

export default ConfirmationPage;