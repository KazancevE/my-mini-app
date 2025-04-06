import React, { useState, useEffect } from 'react';
import s from './choice.module.scss';
import { Select } from 'antd';
import plus from '../../images/plusBtn.svg';
import minus from '../../images/minusBtn.svg';
import dayjs, { Dayjs } from 'dayjs';

type ChoiceProps = {
  type: 'count';
  text: string;
  max: number;
  onChange: (value: number) => void;
} | {
  type: 'time';
  text: string;
  max: number;
  onChange: (value: Dayjs) => void;
};

const TableCard: React.FC<ChoiceProps> = ({ text, max, type, onChange }) => {
  const [counter, setCounter] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<Dayjs>(dayjs());

  useEffect(() => {
    if (type === 'count' && onChange) {
      onChange(counter);
    } else if (type === 'time' && onChange) {
      onChange(selectedTime);
    }
  }, [counter, selectedTime, onChange, type]);

  const handleIncrement = () => {
    setCounter(prev => prev >= max ? prev : prev + 1);
  };

  const handleDecrement = () => {
    setCounter(prev => prev <= 0 ? prev : prev - 1);
  };

  const handleTimeChange = (value: string) => {
    const time = dayjs(value, 'HH:mm');
    setSelectedTime(time);
  };

  return (
    <div className={s.choice}>
      <h6>{text}</h6>
      {type === 'count' && (
        <div className={s.counter_container}>
          <img 
            className={s.counter} 
            onClick={handleDecrement}
            src={minus} 
            alt="Уменьшить" 
          />
          <span>{counter}</span>
          <img 
            className={s.counter} 
            onClick={handleIncrement}
            src={plus} 
            alt="Увеличить" 
          />
        </div>
      )}
      {type === 'time' && (
        <Select
          defaultValue="00:00"
          className={s.timepicker}
          suffixIcon={null}
          style={{ width: '20%' }}
          onChange={handleTimeChange}
          options={[
            { value: '14:00', label: '14:00' },
            { value: '15:00', label: '15:00' },
            { value: '16:00', label: '16:00' },
            { value: '17:00', label: '17:00' },
          ]}
        />
      )}
    </div>
  );
};

export default TableCard;