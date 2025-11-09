import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Ranking from './Ranking';

// Mock fetch
global.fetch = vi.fn();

describe('Ranking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ranking page', async () => {
    // Given
    const mockPlayers = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        ranking: 1,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockPlayers,
    });

    // When
    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>,
    );

    // Then
    await waitFor(() => {
      expect(screen.getByText('🎮 Player Ranking')).toBeInTheDocument();
    });
  });

  it('should display player data', async () => {
    // Given
    const mockPlayers = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        ranking: 1,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockPlayers,
    });

    // When
    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>,
    );

    // Then
    await waitFor(() => {
      expect(screen.getByText('player_001')).toBeInTheDocument();
    });
  });
});

