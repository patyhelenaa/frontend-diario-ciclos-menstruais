import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../services/api';

function Sintomas() {
  const [currentPage, setCurrentPage] = useState(0);
  const [sintomas, setSintomas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const [choices, setChoices] = useState({
    intensidade: [
      { key: 'LEVE', label: 'Leve' },
      { key: 'MODERADO', label: 'Moderado' },
      { key: 'INTENSO', label: 'Intenso' },
      { key: 'MUITO_INTENSO', label: 'Muito Intenso' }
    ],
    humor: [
      { key: 'FELICIDADE', label: 'Felicidade' },
      { key: 'TRISTEZA', label: 'Tristeza' },
      { key: 'IRRITACAO', label: 'Irritação' },
      { key: 'ANSIEDADE', label: 'Ansiedade' }
    ],
    textura_secrecao: [
      { key: 'AQUOSA', label: 'Aquosa' },
      { key: 'CREMOSA', label: 'Cremosa' },
      { key: 'ELASTICA', label: 'Elástica' },
      { key: 'PEGAJOSA', label: 'Pegajosa' }
    ]
  });

  const [ciclos, setCiclos] = useState([]);
  const [cicloIdToData, setCicloIdToData] = useState({});

  // Buscar sintomas do backend ao carregar
  useEffect(() => {
    async function fetchSintomas() {
      setLoading(true);
      setError('');
      try {
        const resFisico = await api.get('/api/fisico/');
        const resHumor = await api.get('/api/humor/');
        const resLibido = await api.get('/api/libido/');
        const resSecrecao = await api.get('/api/secrecao/');
        // Unifica e ordena por data decrescente
        const all = [
          ...resFisico.data.map(s => ({ ...s, tipo: 'Físico' })),
          ...resHumor.data.map(s => ({ ...s, tipo: 'Humor' })),
          ...resLibido.data.map(s => ({ ...s, tipo: 'Libido' })),
          ...resSecrecao.data.map(s => ({ ...s, tipo: 'Secreção' })),
        ];
        all.sort((a, b) => new Date(b.data) - new Date(a.data));
        setSintomas(all);
      } catch (err) {
        setError('Erro ao buscar sintomas.');
      } finally {
        setLoading(false);
      }
    }
    fetchSintomas();
  }, []);

  // Buscar ciclos do backend ao carregar
  useEffect(() => {
    async function fetchCiclos() {
      try {
        const res = await api.get('/api/ciclos/');
        setCiclos(res.data);
        // Monta o mapa id -> data
        const mapa = {};
        res.data.forEach(ciclo => {
          mapa[ciclo.id] = ciclo.data;
        });
        setCicloIdToData(mapa);
      } catch (err) {
        // Não faz nada, sintomas ainda funcionam
      }
    }
    fetchCiclos();
  }, []);

  useEffect(() => {
    async function fetchChoices() {
      try {
        const res = await api.get('/api/sintomas/choices/');
        setChoices(res.data);
      } catch (err) {
        // fallback para os valores fixos
      }
    }
    fetchChoices();
  }, []);

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

  const handleDeleteSintoma = async (id) => {
    const sintoma = sintomas.find(s => s.id === id);
    let endpoint = '';
    if (sintoma.tipo === 'Físico') endpoint = '/api/fisico/';
    else if (sintoma.tipo === 'Humor') endpoint = '/api/humor/';
    else if (sintoma.tipo === 'Libido') endpoint = '/api/libido/';
    else if (sintoma.tipo === 'Secreção') endpoint = '/api/secrecao/';
    if (window.confirm('Tem certeza que deseja excluir este sintoma?')) {
      try {
        await api.delete(`${endpoint}${id}/`);
        setSintomas(sintomas.filter(sintoma => sintoma.id !== id));
        console.log('Excluindo sintoma:', id);
      } catch (err) {
        setError('Erro ao excluir sintoma.');
      }
    }
  };

  const handleNewSintoma = () => {
    setShowNewSintomaModal(true);
  };

  const handleSaveNewSintoma = async () => {
    setLoading(true);
    setError('');
    try {
      const base = {
        data: newSintomaData.data,
        tipo: newSintomaData.tipo,
        intensidade: newSintomaData.intensidade,
        nome_sintoma: newSintomaData.nome_sintoma,
        descricao: newSintomaData.descricao
      };
      let extra = {};
      let endpoint = '';
      if (newSintomaData.tipo === 'Físico') {
        extra = {
          pratica: newSintomaData.pratica,
          remedio_tomado: newSintomaData.remedio_tomado
        };
        endpoint = '/api/fisico/';
      } else if (newSintomaData.tipo === 'Humor') {
        extra = {
          humor: newSintomaData.humor,
          gatilho: newSintomaData.gatilho
        };
        endpoint = '/api/humor/';
      } else if (newSintomaData.tipo === 'Libido') {
        extra = {
          relacoes_com_parceiro: newSintomaData.relacoes_com_parceiro,
          relacoes_sem_parceiro: newSintomaData.relacoes_sem_parceiro
        };
        endpoint = '/api/libido/';
      } else if (newSintomaData.tipo === 'Secreção') {
        extra = {
          textura: newSintomaData.textura,
          remedio_tomado: newSintomaData.remedio_tomado
        };
        endpoint = '/api/secrecao/';
      }
      if (editSintomaId) {
        await api.put(`${endpoint}${editSintomaId}/`, { ...base, ...extra });
      } else {
        await api.post(endpoint, { ...base, ...extra });
      }
      setSintomas(prevSintomas => {
        const newSintomas = [...prevSintomas];
        if (editSintomaId) {
          const index = newSintomas.findIndex(s => s.id === editSintomaId);
          newSintomas[index] = { ...newSintomas[index], ...base, ...extra };
        } else {
          newSintomas.unshift({ ...base, ...extra });
        }
        return newSintomas.sort((a, b) => new Date(b.data) - new Date(a.data));
      });
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
    } catch (err) {
      setError('Erro ao salvar sintoma.');
    } finally {
      setLoading(false);
    }
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
                {loading ? (
                  <p>Carregando sintomas...</p>
                ) : error ? (
                  <p style={{ color: 'red' }}>{error}</p>
                ) : currentSintomas.length === 0 ? (
                  <p>Nenhum sintoma encontrado. Adicione um novo!</p>
                ) : (
                  currentSintomas.map((sintoma) => (
                    <div key={sintoma.id} className="sintomas-card">
                      <h3 className="sintomas-card-title">
                        {sintoma.data}
                      </h3>
                      <div className="sintomas-card-content">
                        {/* Exibe a data de início do ciclo associado, se disponível */}
                        {sintoma.ciclo && cicloIdToData[sintoma.ciclo] && (
                          <p>• Do ciclo: iniciado em <span className="value">{cicloIdToData[sintoma.ciclo]}</span></p>
                        )}
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
                  ))
                )}
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
                    {choices.intensidade.map(choice => (
                      <option key={choice.key} value={choice.key}>{choice.label}</option>
                    ))}
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
                        {choices.humor.map(choice => (
                          <option key={choice.key} value={choice.key}>{choice.label}</option>
                        ))}
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
                        {choices.textura_secrecao.map(choice => (
                          <option key={choice.key} value={choice.key}>{choice.label}</option>
                        ))}
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
                  <button className="sintomas-btn sintomas-btn--save" onClick={handleSaveNewSintoma} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button className="sintomas-btn sintomas-btn--cancel" onClick={handleCancelNewSintoma} disabled={loading}>
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

export default Sintomas; 