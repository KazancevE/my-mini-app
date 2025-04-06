import React from 'react';
import Button from '../../components/Button/Button';
import './home.scss';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const user = window.Telegram.WebApp.initDataUnsafe.user;
  const navigate = useNavigate();
  console.log(user);

  const handlClick = () => {
    console.log('Button clicked');
    navigate('/booking')
  }

  return (
    <div className="home container">
      {user && (
        <img src={user.imagePath} alt="" />
      )}
      <div className="content">
        <h2>Добро пожаловать!</h2>
        {user && (
          <div>
            <p>User: {user.first_name}</p>
            <p>Username: {user.username}</p>
          </div>
        )}
        <br />
        <p>Забронируйте столик в пару кликов и наслаждайтесь уютной атмосферой.</p>
        <br />
        <p>Выберите дату и время</p>
        <p>Укажите количество гостей</p>
        <p>Выберите удобное место</p>
        <br />
        <p>Нажмите «Забронировать стол»</p>
        {/* <p>P.s. Здесь будет указан Ваш реальный текст</p> */}
      </div>
      <Button text='ЗАБРОНИРОВАТЬ СТОЛ' onClick={handlClick} className='button'/>
    </div>
  );
};

export default Home;
