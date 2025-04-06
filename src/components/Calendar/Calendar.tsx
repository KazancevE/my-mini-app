import React, { useState } from "react";
import "./BookingCalendar.scss"; // Подключаем стили

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Текущая дата
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Выбранная дата
  const [selectedTime, setSelectedTime] = useState<string>("18:00"); // Выбранное время

  // Дни недели
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Получить количество дней в месяце
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Получить первый день месяца
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Перелистывание на предыдущий месяц
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Перелистывание на следующий месяц
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Обработчик выбора даты
  const handleDateClick = (day: number) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selected);
  };

  // Генерация календаря
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const blanks = Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1).fill(
      null
    ); // Пустые ячейки для начала месяца
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return [...blanks, ...days].map((day, index) => (
      <div
        key={index}
        className={`calendar-day ${
          day === selectedDate?.getDate() &&
          currentDate.getMonth() === selectedDate.getMonth()
            ? "selected"
            : ""
        } ${day ? "" : "empty"}`}
        onClick={() => day && handleDateClick(day)}
      >
        {day}
      </div>
    ));
  };

  return (
    <div className="booking-calendar">
      {/* Заголовок календаря */}
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      {/* Дни недели */}
      <div className="calendar-weekdays">
        {daysOfWeek.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Календарь */}
      <div className="calendar-grid">{renderCalendar()}</div>

      {/* Выбор времени */}
      <div className="time-picker">
        <h3>Время бронирования</h3>
        <div className="time-slot">
          <span>{selectedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;