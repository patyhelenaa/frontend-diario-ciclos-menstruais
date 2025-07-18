/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';

describe('Profile page', () => {
  it('exibe o título principal', () => {
    render(<MemoryRouter><Profile /></MemoryRouter>);
    expect(screen.getAllByText(/Perfil/i).length).toBeGreaterThan(0);
  });

  it('exibe estatísticas vindas da API', async () => {
    // ... seu mock e teste ...
  });
}); 