import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mascote from '../assets/mascotev2.png';
import Header from '../components/Header';
import api from '../services/api';

function getMessageFromUrl(search) {
  const params = new URLSearchParams(search);
  return params.get('message');
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const message = getMessageFromUrl(location.search);
  const [showDeleted, setShowDeleted] = useState(new URLSearchParams(location.search).get('deleted') === '1');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (showDeleted) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
      const hideTimer = setTimeout(() => setShowDeleted(false), 3000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showDeleted]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    if (value.length < 3) {
      setUsernameError('Username deve ter pelo menos 3 caracteres');
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value.length < 8) {
      setPasswordError('Senha deve ter pelo menos 8 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (username.length < 3) {
      setError('Username deve ter pelo menos 3 caracteres.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    
    try {
      const response = await api.post('/api/login/', {
        username,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // (Opcional) Salvar user info se vier na resposta
      navigate('/profile');
    } catch {
      setError('Erro ao fazer login.');
    }
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div className="login2-bg">
          <div className="login2-container login2-container--large">
            {/* Coluna esquerda */}
            <div className="login2-left">
              <h1 className="login2-title">Entre em sua conta do diário de ciclos menstruais</h1>
              <p className="login2-subtitle">Insira um username e senha válidos.</p>
              <div className="login2-mascot-wrapper">
                <img src={mascote} alt="Mascote" className="login2-mascot login2-mascot--large" />
              </div>
            </div>
            {/* Coluna direita */}
            <div className="login2-right">
              <form className="login2-form" onSubmit={handleSubmit}>
                {showDeleted && (
                  <div
                    className={`login2-message login2-message--fade ${fadeOut ? 'fade-out' : ''}`}
                    style={{
                      color: '#222',
                      border: '1px solid #ddd',
                      background: '#fafafd',
                      marginBottom: 18,
                      padding: '10px 14px',
                      borderRadius: 6,
                      boxSizing: 'border-box',
                      textAlign: 'left',
                    }}
                  >
                    Conta <span style={{ color: '#dc3545', fontWeight: 600 }}>excluída</span> com sucesso!
                  </div>
                )}
                {message && <div className="login2-message">{message}</div>}
                <div className="login2-field">
                  <label className="login2-label" htmlFor="username">
                    Username <span className="required">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    className={`login2-input ${usernameError ? 'login2-input--error' : ''}`}
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    placeholder="Digite seu username"
                  />
                  {usernameError && <div className="login2-field-error">{usernameError}</div>}
                </div>
                
                <div className="login2-field">
                  <label className="login2-label" htmlFor="senha">
                    Senha <span className="required">*</span>
                  </label>
                  <div className="login2-password-wrapper">
                    <input
                      id="senha"
                      name="password"
                      className={`login2-input ${passwordError ? 'login2-input--error' : ''}`}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      className="login2-password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {passwordError && <div className="login2-field-error">{passwordError}</div>}
                </div>
                
                {error && <div className="login2-error">{error}</div>}
                <button className="login2-btn" type="submit">Entrar</button>
              </form>
              <div className="login2-link">
                <Link to="/register">
                  Não tem uma conta?<br />
                  Inscreva-se já!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login; 