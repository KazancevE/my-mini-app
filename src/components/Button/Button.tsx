import React from 'react';
import s from  './Button.module.scss';

interface ButtonProps {
  text: string;
  onClick?: () => void; // Функция обратного вызова для обработки события нажатия
  disabled?: boolean;   // Опциональный пропс для блокировки кнопки
  className?: string;   // Опциональный класс для стилизации
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false, className = '' }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {text}
    </button>
  );
};

export default Button;
