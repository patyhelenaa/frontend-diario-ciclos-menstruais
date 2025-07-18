/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sintomas from './Sintomas';
vi.mock('../services/api');
import api from '../services/api';
import { act } from 'react';

const mockChoices = {
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
};

describe('Sintomas page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe o título principal', () => {
    render(<MemoryRouter><Sintomas /></MemoryRouter>);
    expect(screen.getAllByText(/Sintomas/i).length).toBeGreaterThan(0);
  });

  it('exibe mensagem quando não há sintomas', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/api/fisico/' || url === '/api/humor/' || url === '/api/libido/' || url === '/api/secrecao/') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/api/ciclos/') return Promise.resolve({ data: [] });
      if (url === '/api/sintomas/choices/') return Promise.resolve({ data: mockChoices });
      return Promise.resolve({ data: [] });
    });
    await act(async () => {
      render(<MemoryRouter><Sintomas /></MemoryRouter>);
    });
    expect(await screen.findByText(/Nenhum sintoma encontrado/i)).toBeInTheDocument();
  });

  it('exibe sintomas vindos da API', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/api/fisico/' || url === '/api/humor/' || url === '/api/libido/') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/api/secrecao/') {
        return Promise.resolve({ data: [
          { id: 1, tipo: 'Secreção', data: '2025-07-04', nome_sintoma: 'Secreção vaginal', intensidade: 'MODERADO', textura: 'AQUOSA', remedio_tomado: '' }
        ] });
      }
      if (url === '/api/ciclos/') return Promise.resolve({ data: [] });
      if (url === '/api/sintomas/choices/') return Promise.resolve({ data: mockChoices });
      return Promise.resolve({ data: [] });
    });
    await act(async () => {
      render(<MemoryRouter><Sintomas /></MemoryRouter>);
    });
    expect(await screen.findByText(/Secreção vaginal/i)).toBeInTheDocument();
    expect(await screen.findByText(/AQUOSA/i)).toBeInTheDocument();
    expect(await screen.findByText(/MODERADO/i)).toBeInTheDocument();
  });
}); 