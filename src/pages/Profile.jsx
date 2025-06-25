import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import gotinha from '../assets/gotinha-removebg-preview.png';
import calendario from '../assets/calendario-removebg-preview.png';
import bolinha from '../assets/bolinha-removebg-preview.png';
import api from '../services/api';

function Profile() {
  const [userData, setUserData] = useState({
    nome: '',
    username: '',
    email: '',
    data_nascimento: '',
    peso: ''
  });
  const [cycleData, setCycleData] = useState({
    ultimoCiclo: {
      diasAtras: '-',
      duracaoMenstruacao: '-',
      fluxo: '-'
    },
    previsaoProximo: {
      diasParaProximo: '-',
      duracaoCicloAproximada: '-',
      duracaoMenstruacaoAproximada: '-'
    },
    duracaoMedia: {
      duracaoCiclo: '-',
      duracaoMenstruacao: '-'
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/usuarios/me/');
        setUserData({
          nome: res.data.profile.nome,
          username: res.data.username,
          email: res.data.email,
          data_nascimento: res.data.profile.data_nascimento,
          peso: res.data.profile.peso
        });
      } catch (err) {
        setError('Erro ao buscar dados do perfil.');
      } finally {
        setLoading(false);
      }
    }
    async function fetchCiclosStats() {
      try {
        // Último ciclo
        const resUltimo = await api.get('/api/ciclos/ultimo/');
        const ultimo = resUltimo.data;
        // Previsão próximo ciclo
        const resPrevisao = await api.get('/api/ciclos/previsao/');
        // Duração média
        const resDuracao = await api.get('/api/ciclos/duracao_media/');
        // Dias atrás do último ciclo
        let diasAtras = '-';
        if (ultimo && ultimo.data) {
          diasAtras = Math.ceil((new Date() - new Date(ultimo.data)) / (1000 * 60 * 60 * 24));
        }
        setCycleData({
          ultimoCiclo: {
            diasAtras,
            duracaoMenstruacao: ultimo.duracao_menstruacao,
            fluxo: ultimo.fluxo_menstrual
          },
          previsaoProximo: {
            diasParaProximo: resPrevisao.data.data_previsao
              ? Math.max(0, Math.ceil((new Date(resPrevisao.data.data_previsao) - new Date()) / (1000 * 60 * 60 * 24)))
              : '-',
            duracaoCicloAproximada: resPrevisao.data.duracao_media || '-',
            duracaoMenstruacaoAproximada: ultimo.duracao_menstruacao || '-'
          },
          duracaoMedia: {
            duracaoCiclo: resDuracao.data.duracao_media || '-',
            duracaoMenstruacao: resDuracao.data.duracao_media_menstruacao || '-'
          }
        });
      } catch (err) {
        console.log('ERRO AO BUSCAR ESTATÍSTICAS:', err); // <-- debug
        // Não mostra erro, só não preenche os cards
      }
    }
    fetchProfile();
    fetchCiclosStats();
  }, []);

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await api.put('/api/usuarios/me/', {
        email: editData.email,
        profile: {
          nome: editData.nome,
          data_nascimento: editData.data_nascimento,
          peso: editData.peso
        }
      });
      setUserData(editData);
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao salvar dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete('/api/usuarios/me/');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?deleted=1';
      } catch (err) {
        setError('Erro ao excluir conta.');
      }
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
          {loading && <p>Carregando perfil...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {/* Título e botões de ação */}
          <div className="profile-header">
            <h1 className="profile-title">
              Perfil | Olá, {getFirstName(userData.nome)}!
            </h1>
            <div className="profile-actions">
              <button 
                className="profile-btn profile-btn--edit"
                onClick={handleEdit}
                disabled={loading}
              >
                Editar perfil
              </button>
              <button 
                className="profile-btn profile-btn--delete"
                onClick={handleDeleteAccount}
                disabled={loading}
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
                    <button className="profile-btn profile-btn--save" onClick={handleSave} disabled={loading}>
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button className="profile-btn profile-btn--cancel" onClick={handleCancel} disabled={loading}>
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