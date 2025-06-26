import { useState, useEffect } from 'react';
import Header from '../components/Header';

function Ciclos() {
  const [currentPage, setCurrentPage] = useState(0);
  const [ciclos, setCiclos] = useState([
    {
      id: 1,
      dataInicio: '15/03/2024',
      duracaoCiclo: 28,
      duracaoMenstruacao: 5,
      fluxo: 'Moderado'
    },
    {
      id: 2,
      dataInicio: '12/02/2024',
      duracaoCiclo: 30,
      duracaoMenstruacao: 6,
      fluxo: 'Intenso'
    },
    {
      id: 3,
      dataInicio: '13/01/2024',
      duracaoCiclo: 27,
      duracaoMenstruacao: 4,
      fluxo: 'Leve'
    },
    {
      id: 4,
      dataInicio: '17/12/2023',
      duracaoCiclo: 29,
      duracaoMenstruacao: 5,
      fluxo: 'Moderado'
    },
    {
      id: 5,
      dataInicio: '18/11/2023',
      duracaoCiclo: 28,
      duracaoMenstruacao: 6,
      fluxo: 'Intenso'
    },
    {
      id: 6,
      dataInicio: '21/10/2023',
      duracaoCiclo: 31,
      duracaoMenstruacao: 5,
      fluxo: 'Leve'
    }
  ]);

  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycleData, setNewCycleData] = useState({
    dataInicio: '',
    duracaoCiclo: '',
    duracaoMenstruacao: '',
    fluxo: 'Moderado'
  });

  const [editCycleId, setEditCycleId] = useState(null);

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

  const handleDeleteCiclo = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este ciclo?')) {
      setCiclos(ciclos.filter(ciclo => ciclo.id !== id));
      console.log('Excluindo ciclo:', id);
    }
  };

  const handleNewCycle = () => {
    setShowNewCycleModal(true);
  };

  const handleSaveNewCycle = () => {
    if (editCycleId) {
      // Edição
      setCiclos(ciclos.map(c => c.id === editCycleId ? { ...c, ...newCycleData } : c));
    } else {
      // Criação
      const newCiclo = {
        id: Date.now(),
        ...newCycleData
      };
      setCiclos([newCiclo, ...ciclos]);
    }
    setShowNewCycleModal(false);
    setEditCycleId(null);
    setNewCycleData({
      dataInicio: '',
      duracaoCiclo: '',
      duracaoMenstruacao: '',
      fluxo: 'Moderado'
    });
  };

  const handleCancelNewCycle = () => {
    setShowNewCycleModal(false);
    setEditCycleId(null);
    setNewCycleData({
      dataInicio: '',
      duracaoCiclo: '',
      duracaoMenstruacao: '',
      fluxo: 'Moderado'
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
            
            {/* Cards de ciclos */}
            <div className="ciclos-cards-container">
              {/* Seta esquerda */}
              {currentPage > 0 && (
                <button 
                  className="ciclos-nav-btn ciclos-nav-btn--prev"
                  onClick={handlePrevPage}
                >
                  ←
                </button>
              )}

              {/* Cards */}
              <div className="ciclos-cards">
                {currentCiclos.map((ciclo) => (
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
                ))}
              </div>

              {/* Seta direita */}
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

        {/* Modal para novo ciclo */}
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
                    <option value="Leve">Leve</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Intenso">Intenso</option>
                    <option value="Muito Intenso">Muito Intenso</option>
                  </select>
                </div>
                <div className="ciclos-modal-actions">
                  <button className="ciclos-btn ciclos-btn--save" onClick={handleSaveNewCycle}>
                    Salvar
                  </button>
                  <button className="ciclos-btn ciclos-btn--cancel" onClick={handleCancelNewCycle}>
                    Cancelar
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