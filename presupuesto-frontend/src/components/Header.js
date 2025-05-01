import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo_chaide.svg';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNombre');
    navigate('/');
  };

  return (
    <header className="header">
      <img src={Logo} alt="Logo Chaide" className="header-logo" />
      <span className="logout-text" onClick={handleLogout}>
        Cerrar sesión
      </span>
    </header>
  );
};

export default Header;
