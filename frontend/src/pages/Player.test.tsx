import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlayerPage from './Player';

global.fetch = vi.fn();

describe('PlayerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render player page', async () => {
    // Given
    const mockPlayers = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockPlayers,
    });

    // When
    render(
      <MemoryRouter initialEntries={['/player/player_001']}>
        <PlayerPage />
      </MemoryRouter>,
    );

    // Then
    await waitFor(() => {
      expect(screen.getByText(/Player: player_001/)).toBeInTheDocument();
    });
  });

  it('should display player experience', async () => {
    // Given
    const mockPlayers = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockPlayers,
    });

    // When
    render(
      <MemoryRouter initialEntries={['/player/player_001']}>
        <PlayerPage />
      </MemoryRouter>,
    );

    // Then
    await waitFor(() => {
      expect(screen.getByText('50,000')).toBeInTheDocument();
    });
  });
});

