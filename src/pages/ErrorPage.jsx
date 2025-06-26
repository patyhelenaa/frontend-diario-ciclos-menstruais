import React from 'react';
import assustada from '../assets/assustada-removebg-preview.png';
import { useNavigate } from 'react-router-dom';

function ErrorPage({ message }) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleGoHome = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div className="error-container">
        <img src={assustada} alt="Mascote assustada" className="error-img" />
        <div className="error-content">
          <h1 className="error-title">ERROR</h1>
          <h2 className="error-code">404</h2>
          <p className="error-message">
            {message || 'Ops! Tivemos um erro inesperado. Volte para a página principal e tente novamente!'}
          </p>
          <button className="error-btn" onClick={handleGoHome}>
            Voltar para página inicial
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage; 