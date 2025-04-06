import React from 'react';
import './header.scss';

interface User {
  first_name?: string;
  username?: string;
}

interface HeaderProps {
  user?: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="header">
      <div className="user-info">
        {user ? `${user.first_name || 'Незнакомец'} (${user.username || ''})` : 'Гость'}
      </div>
      <button className="burger-menu">☰</button>
    </header>
  );
};

export default Header;
