import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableCard from '../../components/TableCard/TableCard';
// import './bookingTable.scss';
import './bookingTable.scss'
import table_1 from '../../images/table_1.jpg'
import table_2 from '../../images/table_2.jpg'

const tables = [
  { id: 1, image: table_2, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 2, image: table_1, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 3, image: table_2, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 4, image: table_2, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 5, image: table_1, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 6, image: table_2, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 7, image: table_1, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  { id: 8, image: table_2, description: 'Стол у окна', price: 150, privileges: ['Кофе', 'Розетка'], address: 'ТЦ Галерея​, Проспект Ленина, 137 ​(цокольный этаж)' },
  // Добавьте больше столов по мере необходимости
];

const BookingTable: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, time, hours, guests } = location.state as any;
  console.log(location.state);
  const handleConfirm = (table: any) => {
    navigate('/confirmation', { state: { date, time, hours, guests, table } });
  };
  const guestDescription = (n: number): string => {
    if (n === 1) {
      return 'гость';
    } else if (n > 1 && n < 5) {
      return 'гостя';
    } else {
      return 'гостей';
    }
  };

  return (
    <div className='tableCard'>
      <div className='date'>
        <span>{date}</span>
        <span>{guests} {guestDescription(guests)}</span>
        <span>{time}</span>
        {/* <p>Дата: {date}, Время: {time}, Количество гостей: {guests}</p> */}
      </div>
      {/* <p>Дата: {date}, Время: {time}, Количество гостей: {guests}</p> */}
      <div className="table-cards">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} onSelect={handleConfirm} />
        ))}
      </div>
    </div>
  );
};

export default BookingTable;
