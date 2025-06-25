import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

function Ciclos() {
  const [currentPage, setCurrentPage] = useState(0);
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycleData, setNewCycleData] = useState({
    dataInicio: '',
    duracaoCiclo: '',
    duracaoMenstruacao: '',
    fluxo: 'MODERADO' // valor correto para o backend
  });
  const [editCycleId, setEditCycleId] = useState(null);

  // Buscar ciclos do backend ao carregar
  useEffect(() => {
    async function fetchCiclos() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/ciclos/');
        // Mapeia os campos do backend para o frontend
        const ciclosConvertidos = res.data.map(ciclo => ({
          id: ciclo.id,
          dataInicio: ciclo.data, // backend -> frontend
          duracaoCiclo: ciclo.duracao_ciclo,
          duracaoMenstruacao: ciclo.duracao_menstruacao,
          fluxo: ciclo.fluxo_menstrual
        }));
        setCiclos(ciclosConvertidos);
      } catch (err) {
        setError('Erro ao buscar ciclos.');
      } finally {
        setLoading(false);
      }
    }
    fetchCiclos();
  }, []);

  const ciclosPerPage = 3;
  const totalPages = Math.ceil(ciclos.length / ciclosPerPage);
  const startIndex = currentPage * ciclosPerPage;
  const endIndex = startIndex + ciclosPerPage;
  const currentCiclos = ciclos.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditCiclo = (id) => {
    const ciclo = ciclos.find(c => c.id === id);
    setNewCycleData({
      dataInicio: ciclo.dataInicio,
      duracaoCiclo: ciclo.duracaoCiclo,
      duracaoMenstruacao: ciclo.duracaoMenstruacao,
      fluxo: ciclo.fluxo
    });
    setEditCycleId(id);
    setShowNewCycleModal(true);
  };

  const handleDeleteCiclo = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este ciclo?')) {
      try {
        await api.delete(`/api/ciclos/${id}/`);
        setCiclos(ciclos.filter(ciclo => ciclo.id !== id));
      } catch (err) {
        setError('Erro ao excluir ciclo.');
      }
    }
  };

  const handleNewCycle = () => {
    setShowNewCycleModal(true);
  };

  const handleSaveNewCycle = async () => {
    setLoading(true);
    setError('');
    try {
      // Mapeia os campos para o formato esperado pelo backend
      const cicloPayload = {
        data: newCycleData.dataInicio,
        dia_menstruada: true, // ajuste se for editável
        duracao_ciclo: newCycleData.duracaoCiclo,
        duracao_menstruacao: newCycleData.duracaoMenstruacao,
        fluxo_menstrual: newCycleData.fluxo
      };
      if (editCycleId) {
        await api.put(`/api/ciclos/${editCycleId}/`, cicloPayload);
        setCiclos(ciclos.map(c => c.id === editCycleId ? { ...c, ...newCycleData } : c));
      } else {
        const res = await api.post('/api/ciclos/', cicloPayload);
        setCiclos([res.data, ...ciclos]);
      }
      setShowNewCycleModal(false);
      setEditCycleId(null);
      setNewCycleData({
        dataInicio: '',
        duracaoCiclo: '',
        duracaoMenstruacao: '',
        fluxo: 'MODERADO'
      });
    } catch (err) {
      setError('Erro ao salvar ciclo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNewCycle = () => {
    setShowNewCycleModal(false);
    setEditCycleId(null);
    setNewCycleData({
      dataInicio: '',
      duracaoCiclo: '',
      duracaoMenstruacao: '',
      fluxo: 'MODERADO'
    });
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div className="ciclos-container">
          {/* Título da página */}
          <div className="ciclos-header">
            <h1 className="ciclos-title">Meus ciclos</h1>
            <button 
              className="ciclos-new-btn"
              onClick={handleNewCycle}
            >
              + Novo ciclo
            </button>
          </div>

          {/* Seção de ciclos recentes */}
          <div className="ciclos-section">
            <h2 className="ciclos-section-title">Meus ciclos recentes</h2>
            <div className="ciclos-cards-container">
              {currentPage > 0 && (
                <button 
                  className="ciclos-nav-btn ciclos-nav-btn--prev"
                  onClick={handlePrevPage}
                >
                  ←
                </button>
              )}
              <div className="ciclos-cards">
                {loading ? (
                  <p>Carregando ciclos...</p>
                ) : error ? (
                  <p style={{ color: 'red' }}>{error}</p>
                ) : currentCiclos.length === 0 ? (
                  <p>Nenhum ciclo encontrado. Adicione um novo!</p>
                ) : (
                  currentCiclos.map((ciclo) => (
                    <div key={ciclo.id} className="ciclos-card">
                      <h3 className="ciclos-card-title">
                        Iniciado em {ciclo.dataInicio}
                      </h3>
                      <div className="ciclos-card-content">
                        <p>• Duração do ciclo: <span className="value">{ciclo.duracaoCiclo}</span> dias</p>
                        <p>• Duração da menstruação: <span className="value">{ciclo.duracaoMenstruacao}</span> dias</p>
                        <p>• Fluxo: <span className="value">{ciclo.fluxo}</span></p>
                      </div>
                      <div className="ciclos-card-actions">
                        <button 
                          className="ciclos-action-btn ciclos-action-btn--edit"
                          onClick={() => handleEditCiclo(ciclo.id)}
                        >
                          Editar
                        </button>
                        <button 
                          className="ciclos-action-btn ciclos-action-btn--delete"
                          onClick={() => handleDeleteCiclo(ciclo.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {currentPage < totalPages - 1 && (
                <button 
                  className="ciclos-nav-btn ciclos-nav-btn--next"
                  onClick={handleNextPage}
                >
                  →
                </button>
              )}
            </div>
          </div>
        </div>
        {showNewCycleModal && (
          <div className="ciclos-modal">
            <div className="ciclos-modal-content">
              <h2>{editCycleId ? 'Editar Ciclo' : 'Novo Ciclo'}</h2>
              <div className="ciclos-form">
                <div className="ciclos-field">
                  <label>Data de início:</label>
                  <input
                    type="date"
                    value={newCycleData.dataInicio}
                    onChange={(e) => setNewCycleData({...newCycleData, dataInicio: e.target.value})}
                  />
                </div>
                <div className="ciclos-field">
                  <label>Duração do ciclo (dias):</label>
                  <input
                    type="number"
                    value={newCycleData.duracaoCiclo}
                    onChange={(e) => setNewCycleData({...newCycleData, duracaoCiclo: parseInt(e.target.value)})}
                  />
                </div>
                <div className="ciclos-field">
                  <label>Duração da menstruação (dias):</label>
                  <input
                    type="number"
                    value={newCycleData.duracaoMenstruacao}
                    onChange={(e) => setNewCycleData({...newCycleData, duracaoMenstruacao: parseInt(e.target.value)})}
                  />
                </div>
                <div className="ciclos-field">
                  <label>Fluxo:</label>
                  <select
                    value={newCycleData.fluxo}
                    onChange={(e) => setNewCycleData({...newCycleData, fluxo: e.target.value})}
                  >
                    <option value="LEVE">Leve</option>
                    <option value="MODERADO">Moderado</option>
                    <option value="INTENSO">Intenso</option>
                    <option value="MUITO_INTENSO">Muito Intenso</option>
                  </select>
                </div>
                <div className="ciclos-modal-actions">
                  <button className="ciclos-btn ciclos-btn--save" onClick={handleSaveNewCycle} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button className="ciclos-btn ciclos-btn--cancel" onClick={handleCancelNewCycle} disabled={loading}>
                    {loading ? 'Cancelando...' : 'Cancelar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Ciclos; 