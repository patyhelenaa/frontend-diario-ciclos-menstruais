import { useState, useEffect } from 'react';
import Header from '../components/Header';

function Sintomas() {
  const [currentPage, setCurrentPage] = useState(0);
  const [sintomas, setSintomas] = useState([
    {
      id: 1,
      data: '15/03/2024',
      tipo: 'Físico',
      intensidade: 'MUITO_INTENSO',
      nome_sintoma: 'Cólicas',
      remedio_tomado: 'Ibuprofeno',
      pratica: true,
      descricao: 'Cólicas intensas no primeiro dia'
    },
    {
      id: 2,
      data: '14/03/2024',
      tipo: 'Humor',
      intensidade: 'INTENSO',
      nome_sintoma: 'Irritação',
      humor: 'IRRITACAO',
      gatilho: 'Estresse no trabalho',
      descricao: 'Muito irritada com pequenas coisas'
    },
    {
      id: 3,
      data: '13/03/2024',
      tipo: 'Físico',
      intensidade: 'MODERADO',
      nome_sintoma: 'Fadiga',
      remedio_tomado: '',
      pratica: false,
      descricao: 'Cansada durante o dia'
    },
    {
      id: 4,
      data: '12/03/2024',
      tipo: 'Libido',
      intensidade: 'LEVE',
      nome_sintoma: 'Alteração na libido',
      relacoes_com_parceiro: true,
      relacoes_sem_parceiro: false,
      descricao: 'Aumento no desejo sexual'
    },
    {
      id: 5,
      data: '11/03/2024',
      tipo: 'Secreção',
      intensidade: 'MODERADO',
      nome_sintoma: 'Secreção vaginal',
      textura: 'CREMOSA',
      remedio_tomado: '',
      descricao: 'Secreção normal do ciclo'
    },
    {
      id: 6,
      data: '10/03/2024',
      tipo: 'Humor',
      intensidade: 'LEVE',
      nome_sintoma: 'Ansiedade',
      humor: 'ANSIEDADE',
      gatilho: 'Preparação para reunião',
      descricao: 'Ansiedade leve antes de eventos'
    }
  ]);

  const [showNewSintomaModal, setShowNewSintomaModal] = useState(false);
  const [newSintomaData, setNewSintomaData] = useState({
    data: '',
    tipo: 'Físico',
    intensidade: 'MODERADO',
    nome_sintoma: '',
    descricao: '',
    remedio_tomado: '',
    pratica: false,
    humor: 'FELICIDADE',
    gatilho: '',
    textura: 'AQUOSA',
    relacoes_com_parceiro: false,
    relacoes_sem_parceiro: false
  });

  const [editSintomaId, setEditSintomaId] = useState(null);

  const sintomasPerPage = 3;
  const totalPages = Math.ceil(sintomas.length / sintomasPerPage);
  const startIndex = currentPage * sintomasPerPage;
  const endIndex = startIndex + sintomasPerPage;
  const currentSintomas = sintomas.slice(startIndex, endIndex);

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

  const handleEditSintoma = (id) => {
    const sintoma = sintomas.find(s => s.id === id);
    setNewSintomaData({ ...sintoma });
    setEditSintomaId(id);
    setShowNewSintomaModal(true);
  };

  const handleDeleteSintoma = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este sintoma?')) {
      setSintomas(sintomas.filter(sintoma => sintoma.id !== id));
      console.log('Excluindo sintoma:', id);
    }
  };

  const handleNewSintoma = () => {
    setShowNewSintomaModal(true);
  };

  const handleSaveNewSintoma = () => {
    // Montar objeto só com os campos relevantes
    const base = {
      id: editSintomaId ? editSintomaId : Date.now(),
      data: newSintomaData.data,
      tipo: newSintomaData.tipo,
      intensidade: newSintomaData.intensidade,
      nome_sintoma: newSintomaData.nome_sintoma,
      descricao: newSintomaData.descricao
    };
    let extra = {};
    if (newSintomaData.tipo === 'Físico') {
      extra = {
        pratica: newSintomaData.pratica,
        remedio_tomado: newSintomaData.remedio_tomado
      };
    } else if (newSintomaData.tipo === 'Humor') {
      extra = {
        humor: newSintomaData.humor,
        gatilho: newSintomaData.gatilho
      };
    } else if (newSintomaData.tipo === 'Libido') {
      extra = {
        relacoes_com_parceiro: newSintomaData.relacoes_com_parceiro,
        relacoes_sem_parceiro: newSintomaData.relacoes_sem_parceiro
      };
    } else if (newSintomaData.tipo === 'Secreção') {
      extra = {
        textura: newSintomaData.textura,
        remedio_tomado: newSintomaData.remedio_tomado
      };
    }
    if (editSintomaId) {
      setSintomas(sintomas.map(s => s.id === editSintomaId ? { ...base, ...extra } : s));
    } else {
      setSintomas([{ ...base, ...extra }, ...sintomas]);
    }
    setShowNewSintomaModal(false);
    setEditSintomaId(null);
    setNewSintomaData({
      data: '',
      tipo: 'Físico',
      intensidade: 'MODERADO',
      nome_sintoma: '',
      descricao: '',
      remedio_tomado: '',
      pratica: false,
      humor: 'FELICIDADE',
      gatilho: '',
      textura: 'AQUOSA',
      relacoes_com_parceiro: false,
      relacoes_sem_parceiro: false
    });
  };

  const handleCancelNewSintoma = () => {
    setShowNewSintomaModal(false);
    setEditSintomaId(null);
    setNewSintomaData({
      data: '',
      tipo: 'Físico',
      intensidade: 'MODERADO',
      nome_sintoma: '',
      descricao: '',
      remedio_tomado: '',
      pratica: false,
      humor: 'FELICIDADE',
      gatilho: '',
      textura: 'AQUOSA',
      relacoes_com_parceiro: false,
      relacoes_sem_parceiro: false
    });
  };

  const getIntensidadeLabel = (intensidade) => {
    const labels = {
      'LEVE': 'Leve',
      'MODERADO': 'Moderado',
      'INTENSO': 'Intenso',
      'MUITO_INTENSO': 'Muito Intenso'
    };
    return labels[intensidade] || intensidade;
  };

  const getHumorLabel = (humor) => {
    const labels = {
      'FELICIDADE': 'Felicidade',
      'TRISTEZA': 'Tristeza',
      'IRRITACAO': 'Irritação',
      'ANSIEDADE': 'Ansiedade'
    };
    return labels[humor] || humor;
  };

  const getTexturaLabel = (textura) => {
    const labels = {
      'AQUOSA': 'Aquosa',
      'CREMOSA': 'Cremosa',
      'ELASTICA': 'Elástica',
      'PEGAJOSA': 'Pegajosa'
    };
    return labels[textura] || textura;
  };

  const renderSintomaContent = (sintoma) => {
    switch (sintoma.tipo) {
      case 'Físico':
        return (
          <>
            <p>• Intensidade: <span className="value">{getIntensidadeLabel(sintoma.intensidade)}</span></p>
            <p>• Remédios tomados: <span className="value">{sintoma.remedio_tomado || 'Nenhum'}</span></p>
            <p>• Praticou exercícios: <span className="value">{sintoma.pratica ? 'Sim' : 'Não'}</span></p>
          </>
        );
      case 'Humor':
        return (
          <>
            <p>• Intensidade: <span className="value">{getIntensidadeLabel(sintoma.intensidade)}</span></p>
            <p>• Humor: <span className="value">{getHumorLabel(sintoma.humor)}</span></p>
            <p>• Gatilho: <span className="value">{sintoma.gatilho || 'Nenhum'}</span></p>
          </>
        );
      case 'Libido':
        return (
          <>
            <p>• Intensidade: <span className="value">{getIntensidadeLabel(sintoma.intensidade)}</span></p>
            <p>• Relações com parceiro: <span className="value">{sintoma.relacoes_com_parceiro ? 'Sim' : 'Não'}</span></p>
            <p>• Relações sem parceiro: <span className="value">{sintoma.relacoes_sem_parceiro ? 'Sim' : 'Não'}</span></p>
          </>
        );
      case 'Secreção':
        return (
          <>
            <p>• Intensidade: <span className="value">{getIntensidadeLabel(sintoma.intensidade)}</span></p>
            <p>• Textura: <span className="value">{getTexturaLabel(sintoma.textura)}</span></p>
            <p>• Remédios tomados: <span className="value">{sintoma.remedio_tomado || 'Nenhum'}</span></p>
          </>
        );
      default:
        return <p>• Descrição: <span className="value">{sintoma.descricao}</span></p>;
    }
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div className="sintomas-container">
          {/* Título da página */}
          <div className="sintomas-header">
            <h1 className="sintomas-title">Sintomas</h1>
            <button 
              className="sintomas-new-btn"
              onClick={handleNewSintoma}
            >
              + Novo Sintoma
            </button>
          </div>

          {/* Seção de sintomas recentes */}
          <div className="sintomas-section">
            <h2 className="sintomas-section-title">Meus sintomas recentes</h2>
            
            {/* Cards de sintomas */}
            <div className="sintomas-cards-container">
              {/* Seta esquerda */}
              {currentPage > 0 && (
                <button 
                  className="sintomas-nav-btn sintomas-nav-btn--prev"
                  onClick={handlePrevPage}
                >
                  ←
                </button>
              )}

              {/* Cards */}
              <div className="sintomas-cards">
                {currentSintomas.map((sintoma) => (
                  <div key={sintoma.id} className="sintomas-card">
                    <h3 className="sintomas-card-title">
                      {sintoma.data}
                    </h3>
                    <div className="sintomas-card-content">
                      <p>• Tipo: <span className="value">{sintoma.tipo}</span></p>
                      <p>• Sintoma: <span className="value">{sintoma.nome_sintoma}</span></p>
                      {renderSintomaContent(sintoma)}
                    </div>
                    <div className="sintomas-card-actions">
                      <button 
                        className="sintomas-action-btn sintomas-action-btn--edit"
                        onClick={() => handleEditSintoma(sintoma.id)}
                      >
                        Editar
                      </button>
                      <button 
                        className="sintomas-action-btn sintomas-action-btn--delete"
                        onClick={() => handleDeleteSintoma(sintoma.id)}
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
                  className="sintomas-nav-btn sintomas-nav-btn--next"
                  onClick={handleNextPage}
                >
                  →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal para novo sintoma */}
        {showNewSintomaModal && (
          <div className="sintomas-modal">
            <div className="sintomas-modal-content">
              <h2>{editSintomaId ? 'Editar Sintoma' : 'Novo Sintoma'}</h2>
              <div className="sintomas-form">
                <div className="sintomas-field">
                  <label>Data:</label>
                  <input
                    type="date"
                    value={newSintomaData.data}
                    onChange={(e) => setNewSintomaData({...newSintomaData, data: e.target.value})}
                  />
                </div>
                <div className="sintomas-field">
                  <label>Tipo de sintoma:</label>
                  <select
                    value={newSintomaData.tipo}
                    onChange={(e) => setNewSintomaData({...newSintomaData, tipo: e.target.value})}
                  >
                    <option value="Físico">Físico</option>
                    <option value="Humor">Humor</option>
                    <option value="Libido">Libido</option>
                    <option value="Secreção">Secreção</option>
                  </select>
                </div>
                <div className="sintomas-field">
                  <label>Nome do sintoma:</label>
                  <input
                    type="text"
                    value={newSintomaData.nome_sintoma}
                    onChange={(e) => setNewSintomaData({...newSintomaData, nome_sintoma: e.target.value})}
                  />
                </div>
                <div className="sintomas-field">
                  <label>Intensidade:</label>
                  <select
                    value={newSintomaData.intensidade}
                    onChange={(e) => setNewSintomaData({...newSintomaData, intensidade: e.target.value})}
                  >
                    <option value="LEVE">Leve</option>
                    <option value="MODERADO">Moderado</option>
                    <option value="INTENSO">Intenso</option>
                    <option value="MUITO_INTENSO">Muito Intenso</option>
                  </select>
                </div>
                {/* Campos dinâmicos por tipo */}
                {newSintomaData.tipo === 'Físico' && (
                  <>
                    <div className="sintomas-field">
                      <label>Praticou exercícios?</label>
                      <select
                        value={newSintomaData.pratica ? 'Sim' : 'Não'}
                        onChange={e => setNewSintomaData({...newSintomaData, pratica: e.target.value === 'Sim'})}
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                    <div className="sintomas-field">
                      <label>Remédios tomados:</label>
                      <input
                        type="text"
                        value={newSintomaData.remedio_tomado}
                        onChange={e => setNewSintomaData({...newSintomaData, remedio_tomado: e.target.value})}
                      />
                    </div>
                  </>
                )}
                {newSintomaData.tipo === 'Humor' && (
                  <>
                    <div className="sintomas-field">
                      <label>Humor:</label>
                      <select
                        value={newSintomaData.humor}
                        onChange={e => setNewSintomaData({...newSintomaData, humor: e.target.value})}
                      >
                        <option value="FELICIDADE">Felicidade</option>
                        <option value="TRISTEZA">Tristeza</option>
                        <option value="IRRITACAO">Irritação</option>
                        <option value="ANSIEDADE">Ansiedade</option>
                      </select>
                    </div>
                    <div className="sintomas-field">
                      <label>Gatilho:</label>
                      <input
                        type="text"
                        value={newSintomaData.gatilho}
                        onChange={e => setNewSintomaData({...newSintomaData, gatilho: e.target.value})}
                      />
                    </div>
                  </>
                )}
                {newSintomaData.tipo === 'Libido' && (
                  <>
                    <div className="sintomas-field">
                      <label>Relações com parceiro?</label>
                      <select
                        value={newSintomaData.relacoes_com_parceiro ? 'Sim' : 'Não'}
                        onChange={e => setNewSintomaData({...newSintomaData, relacoes_com_parceiro: e.target.value === 'Sim'})}
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                    <div className="sintomas-field">
                      <label>Relações sem parceiro?</label>
                      <select
                        value={newSintomaData.relacoes_sem_parceiro ? 'Sim' : 'Não'}
                        onChange={e => setNewSintomaData({...newSintomaData, relacoes_sem_parceiro: e.target.value === 'Sim'})}
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                  </>
                )}
                {newSintomaData.tipo === 'Secreção' && (
                  <>
                    <div className="sintomas-field">
                      <label>Textura:</label>
                      <select
                        value={newSintomaData.textura}
                        onChange={e => setNewSintomaData({...newSintomaData, textura: e.target.value})}
                      >
                        <option value="AQUOSA">Aquosa</option>
                        <option value="CREMOSA">Cremosa</option>
                        <option value="ELASTICA">Elástica</option>
                        <option value="PEGAJOSA">Pegajosa</option>
                      </select>
                    </div>
                    <div className="sintomas-field">
                      <label>Remédios tomados:</label>
                      <input
                        type="text"
                        value={newSintomaData.remedio_tomado}
                        onChange={e => setNewSintomaData({...newSintomaData, remedio_tomado: e.target.value})}
                      />
                    </div>
                  </>
                )}
                <div className="sintomas-field">
                  <label>Descrição:</label>
                  <textarea
                    value={newSintomaData.descricao}
                    onChange={(e) => setNewSintomaData({...newSintomaData, descricao: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="sintomas-modal-actions">
                  <button className="sintomas-btn sintomas-btn--save" onClick={handleSaveNewSintoma}>
                    Salvar
                  </button>
                  <button className="sintomas-btn sintomas-btn--cancel" onClick={handleCancelNewSintoma}>
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

export default Sintomas; 