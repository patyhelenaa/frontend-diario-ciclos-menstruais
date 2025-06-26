import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mascote from '../assets/mascotev2.png';
import Header from '../components/Header';
import api from '../services/api';

function getMessageFromUrl(search) {
  const params = new URLSearchParams(search);
  return params.get('message');
}

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    data_nascimento: '',
    peso: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const message = getMessageFromUrl(location.search);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'username':
        if (value.length < 3) {
          error = 'Username deve ter pelo menos 3 caracteres';
        }
        break;
      case 'email':
        if (!value.includes('@') || !value.includes('.')) {
          error = 'Email deve ser válido';
        }
        break;
      case 'password':
        if (value.length < 8) {
          error = 'Senha deve ter pelo menos 8 caracteres';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Senhas não coincidem';
        }
        break;
      case 'nome':
        if (value.length < 2) {
          error = 'Nome deve ter pelo menos 2 caracteres';
        }
        break;
      case 'data_nascimento':
        if (!value) {
          error = 'Data de nascimento é obrigatória';
        }
        break;
      case 'peso':
        if (!value || parseFloat(value) <= 0) {
          error = 'Peso deve ser um valor válido';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validar todos os campos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError('Por favor, corrija os erros no formulário.');
      return;
    }
    
    try {
      await api.post('/api/usuarios/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile: {
          nome: formData.nome,
          data_nascimento: formData.data_nascimento,
          peso: formData.peso
        }
      });
      navigate('/login?message=Conta criada com sucesso! Faça login para continuar.');
    } catch (err) {
      setSubmitError('Erro ao criar conta. Verifique os dados ou tente outro username/email.');
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
              <h1 className="login2-title">Crie uma conta</h1>
              <p className="login2-subtitle">Insira seus detalhes e escolha uma senha que tenha ao menos 8 caracteres, com letras maiúsculas e minúsculas.</p>
              <div className="login2-mascot-wrapper">
                <img src={mascote} alt="Mascote" className="login2-mascot login2-mascot--large" />
              </div>
            </div>
            {/* Coluna direita */}
            <div className="login2-right">
              {message && <div className="login2-message">{message}</div>}
              <form className="login2-form" onSubmit={handleSubmit} style={{ marginTop: '-60px' }}>
                <div className="login2-field">
                  <label className="login2-label" htmlFor="username">
                    Username <span className="required">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    className={`login2-input ${errors.username ? 'login2-input--error' : ''}`}
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu username"
                  />
                  {errors.username && <div className="login2-field-error">{errors.username}</div>}
                </div>

                <div className="login2-field">
                  <label className="login2-label" htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    className={`login2-input ${errors.email ? 'login2-input--error' : ''}`}
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu email"
                  />
                  {errors.email && <div className="login2-field-error">{errors.email}</div>}
                </div>

                <div className="login2-field">
                  <label className="login2-label" htmlFor="password">
                    Senha <span className="required">*</span>
                  </label>
                  <div className="login2-password-wrapper">
                    <input
                      id="password"
                      name="password"
                      className={`login2-input ${errors.password ? 'login2-input--error' : ''}`}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      className="login2-password-toggle"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && <div className="login2-field-error">{errors.password}</div>}
                </div>

                <div className="login2-field">
                  <label className="login2-label" htmlFor="confirmPassword">
                    Confirme a senha <span className="required">*</span>
                  </label>
                  <div className="login2-password-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`login2-input ${errors.confirmPassword ? 'login2-input--error' : ''}`}
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      className="login2-password-toggle"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="login2-field-error">{errors.confirmPassword}</div>}
                </div>

                {/* Linha divisória entre dados de usuário e perfil */}
                <div style={{
                  width: '120%',
                  height: '2px',
                  backgroundColor: '#000',
                  margin: '30px -10%',
                  borderRadius: '1px'
                }}></div>

                <div className="login2-field">
                  <label className="login2-label" htmlFor="nome">
                    Nome <span className="required">*</span>
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    className={`login2-input ${errors.nome ? 'login2-input--error' : ''}`}
                    type="text"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu nome completo"
                  />
                  {errors.nome && <div className="login2-field-error">{errors.nome}</div>}
                </div>

                <div className="login2-field">
                  <label className="login2-label" htmlFor="data_nascimento">
                    Data de nascimento <span className="required">*</span>
                  </label>
                  <input
                    id="data_nascimento"
                    name="data_nascimento"
                    className={`login2-input ${errors.data_nascimento ? 'login2-input--error' : ''}`}
                    type="date"
                    value={formData.data_nascimento}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.data_nascimento && <div className="login2-field-error">{errors.data_nascimento}</div>}
                </div>

                <div className="login2-field">
                  <label className="login2-label" htmlFor="peso">
                    Peso (kg) <span className="required">*</span>
                  </label>
                  <input
                    id="peso"
                    name="peso"
                    className={`login2-input ${errors.peso ? 'login2-input--error' : ''}`}
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: 65.5"
                  />
                  {errors.peso && <div className="login2-field-error">{errors.peso}</div>}
                </div>

                {submitError && <div className="login2-error">{submitError}</div>}
                <button className="login2-btn" type="submit">Criar conta</button>
              </form>
              <div className="login2-link">
                <Link to="/login">
                  Eu já tenho uma conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register; 