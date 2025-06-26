import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import gotinha from '../assets/gotinha-removebg-preview.png';
import calendario from '../assets/calendario-removebg-preview.png';
import bolinha from '../assets/bolinha-removebg-preview.png';

function Profile() {
  const [userData, setUserData] = useState({
    nome: 'Maria Silva',
    username: 'mariasilva',
    email: 'maria@email.com',
    data_nascimento: '1995-03-15',
    peso: 65.5
  });

  const [cycleData, setCycleData] = useState({
    ultimoCiclo: {
      diasAtras: 28,
      duracaoMenstruacao: 5,
      fluxo: 'Moderado'
    },
    previsaoProximo: {
      diasParaProximo: 13,
      duracaoCicloAproximada: 28,
      duracaoMenstruacaoAproximada: 5
    },
    duracaoMedia: {
      duracaoCiclo: 28,
      duracaoMenstruacao: 5
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Aqui você faria a chamada para a API para buscar os dados do usuário
    // e os dados dos ciclos
    console.log('Carregando dados do perfil...');
    
    // Simular login para teste
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ nome: 'Maria Silva' }));
    }
  }, []);

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    // Aqui você faria a chamada para a API para salvar os dados
    console.log('Salvando dados do perfil...', editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Aqui você faria a chamada para a API para deletar a conta
      console.log('Deletando conta...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?deleted=1';
    }
  };

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div className="profile-container">
          {/* Título e botões de ação */}
          <div className="profile-header">
            <h1 className="profile-title">
              Perfil | Olá, {getFirstName(userData.nome)}!
            </h1>
            <div className="profile-actions">
              <button 
                className="profile-btn profile-btn--edit"
                onClick={handleEdit}
              >
                Editar perfil
              </button>
              <button 
                className="profile-btn profile-btn--delete"
                onClick={handleDeleteAccount}
              >
                Excluir conta
              </button>
            </div>
          </div>

          {/* Modal de edição */}
          {isEditing && (
            <div className="profile-modal">
              <div className="profile-modal-content">
                <h2>Editar Perfil</h2>
                <div className="profile-form">
                  <div className="profile-field">
                    <label>Nome:</label>
                    <input
                      type="text"
                      value={editData.nome || ''}
                      onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Data de Nascimento:</label>
                    <input
                      type="date"
                      value={editData.data_nascimento || ''}
                      onChange={(e) => setEditData({...editData, data_nascimento: e.target.value})}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Peso (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editData.peso || ''}
                      onChange={(e) => setEditData({...editData, peso: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="profile-modal-actions">
                    <button className="profile-btn profile-btn--save" onClick={handleSave}>
                      Salvar
                    </button>
                    <button className="profile-btn profile-btn--cancel" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards de informações */}
          <div className="profile-cards">
            {/* Último ciclo */}
            <div className="profile-card">
              <img src={gotinha} alt="Ícone gotinha" className="profile-card-img" />
              <h3 className="profile-card-title">Último ciclo</h3>
              <div className="profile-card-content">
                <p>• Há: <span className="value">{cycleData.ultimoCiclo.diasAtras}</span> dias</p>
                <p>• Duração da menstruação: <span className="value">{cycleData.ultimoCiclo.duracaoMenstruacao}</span> dias</p>
                <p>• Fluxo: <span className="value">{cycleData.ultimoCiclo.fluxo}</span></p>
              </div>
            </div>

            {/* Previsão próximo ciclo */}
            <div className="profile-card">
              <img src={calendario} alt="Ícone calendário" className="profile-card-img" />
              <h3 className="profile-card-title">Previsão próximo ciclo</h3>
              <div className="profile-card-content">
                <p>• Em: <span className="value">{cycleData.previsaoProximo.diasParaProximo}</span> dias</p>
                <p>• Duração do ciclo: <span className="value">{cycleData.previsaoProximo.duracaoCicloAproximada}</span> dias</p>
                <p>• Duração da menstruação: <span className="value">{cycleData.previsaoProximo.duracaoMenstruacaoAproximada}</span> dias</p>
              </div>
            </div>

            {/* Duração média */}
            <div className="profile-card">
              <img src={bolinha} alt="Ícone bolinha" className="profile-card-img" />
              <h3 className="profile-card-title">Duração média</h3>
              <div className="profile-card-content">
                <p>• Duração do ciclo: <span className="value">{cycleData.duracaoMedia.duracaoCiclo}</span> dias</p>
                <p>• Duração da menstruação: <span className="value">{cycleData.duracaoMedia.duracaoMenstruacao}</span> dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile; 