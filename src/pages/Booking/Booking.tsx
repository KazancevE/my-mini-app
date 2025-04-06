import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CalendarProps, ConfigProvider, Select, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // Импорт русской локализации dayjs
import ru_RU from 'antd/locale/ru_RU'; // Правильный путь для Ant Design v5
import s from './booking.module.scss';
import Choice from '../../components/Choice/Choice';
import Button from '../../components/Button/Button';
import BookingCalendar from '../../components/Calendar/Calendar';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import ru_RU from '@ant-design/locale-ru_RU';
dayjs.locale('ru');

const DatePickerPage: React.FC = () => {
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [time, setTime] = useState<string>(dayjs().format('HH:mm'));
  const [hours, setHours] = useState<number>(0); // Указали тип number и начальное значение
  const [guests, setGuests] = useState<number>(0); // Указали тип number и начальное значение
  const navigate = useNavigate();

  console.log(date, time, hours, guests);

  const handleNext = () => {
    if (hours > 0 && guests > 0) { // Проверка, что значения выбраны
      navigate('/tables', { state: { date, time, hours, guests } });
    } else {
      alert('Пожалуйста, укажите продолжительность и количество гостей');
    }
  };

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const getDate = (value: Dayjs) => {
    setDate(value.format('YYYY-MM-DD'));
  };

  const getTime = (value: Dayjs) => {
    setTime(value.format('HH:mm'));
  };

  const getHours = (count: number) => {
    setHours(count);
  };

  const getGuests = (count: number) => {
    setGuests(count);
  };

  return (
    <ConfigProvider locale={ru_RU}>
      <div className='container'
      style={ {paddingTop: '5vh'} }>
        {/* <h2>Выберите дату и время</h2> */}
        <div className={s.wrapperStyle}>
          <Calendar 
            fullscreen={false} 
            onPanelChange={onPanelChange} 
            onChange={getDate}
            headerRender={({ value, onChange }) => (
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '16px'
              }}>

                <span style={{ textTransform: 'capitalize', color: '#5856D6'}}>
                  {value.format('MMMM YYYY')}
                </span>
                <div>
                  <LeftOutlined 
                    onClick={() => onChange(value.clone().subtract(1, 'month'))}
                    style={{ cursor: 'pointer', fontSize: '14px', color: '#5856D6', marginLeft: '1vh' }}
                  />
                  <RightOutlined 
                    onClick={() => onChange(value.clone().add(1, 'month'))}
                    style={{ cursor: 'pointer', fontSize: '14px', color: '#5856D6', marginLeft: '1vh' }}
                  />
                </div>
                
              </div>
            )}
          />
          
        </div>

          <Choice 
            type='time'
            text='Время бронирования' 
            max={9} 
            onChange={(value: Dayjs) => getTime(value)} // Правильная передача функции
          />

          <Choice 
            type='count'
            text='Продолжительность' 
            max={9} 
            onChange={getHours} // Упрощенная передача функции
          />
          <Choice 
            type='count'
            text='Количество гостей' 
            max={10} 
            onChange={getGuests} // Упрощенная передача функции
          />

        <Button 
          text='ПЕРЕЙТИ К БРОНИРОВАНИЮ' 
          onClick={handleNext} 
          className={s.button}
        />
      </div>
    </ConfigProvider>
    
  );
};

export default DatePickerPage;