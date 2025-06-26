import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const isLoggedIn = localStorage.getItem('token');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link 
          to={isLoggedIn ? "/profile" : "/"} 
          className="header-title-link"
        >
          <span className="header-title">
            Diário de ciclos Menstruais
          </span>
        </Link>
        
        {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && (
          <nav className="header-nav">
            <Link 
              to="/ciclos" 
              className={`header-nav-link ${location.pathname === '/ciclos' ? 'active' : ''}`}
            >
              Meus ciclos
            </Link>
            <Link 
              to="/sintomas" 
              className={`header-nav-link ${location.pathname === '/sintomas' ? 'active' : ''}`}
            >
              Sintomas
            </Link>
            <Link 
              to="/profile" 
              className={`header-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              Perfil
            </Link>
            <button 
              onClick={handleLogout}
              className="header-nav-link header-nav-link--logout"
            >
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header; 