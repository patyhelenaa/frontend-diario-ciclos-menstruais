/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Ciclos from './Ciclos';
vi.mock('../services/api');
import api from '../services/api';
import { act } from 'react';

describe('Ciclos page', () => {
  it('exibe o título principal', () => {
    render(<MemoryRouter><Ciclos /></MemoryRouter>);
    expect(screen.getAllByText(/Meus ciclos/i).length).toBeGreaterThan(0);
  });

  it('exibe mensagem quando não há ciclos', async () => {
    api.get.mockResolvedValueOnce({ data: [] }); // para /api/ciclos/
    render(<MemoryRouter><Ciclos /></MemoryRouter>);
    expect(await screen.findByText(/Nenhum ciclo encontrado/i)).toBeInTheDocument();
  });

  it('exibe ciclos vindos da API', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { id: 1, data: '2025-07-04', duracao_ciclo: 28, duracao_menstruacao: 5, fluxo_menstrual: 'MODERADO' }
      ]
    });
    await act(async () => {
      render(<MemoryRouter><Ciclos /></MemoryRouter>);
    });
    // Busca 'Iniciado em' e a data juntos, pois o componente renderiza assim
    expect(await screen.findByText(/Iniciado em 2025-07-04/)).toBeInTheDocument();
    expect(await screen.findByText(/28/)).toBeInTheDocument();
    expect(await screen.findByText(/MODERADO/)).toBeInTheDocument();
  });
}); 