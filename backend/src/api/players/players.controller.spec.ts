import { PlayersController } from './players.controller';
import { PlayersRanking, PlayerRankingView } from '@/players-ranking/players-ranking';
import { describe, it, expect, beforeEach, vi } from 'vitest';

global.fetch = vi.fn();

describe('PlayersController', () => {
  let controller: PlayersController;
  let mockPlayerService: {
    getDailyRanking: ReturnType<typeof vi.fn>;
    getPlayerRanking: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockPlayerService = {
      getDailyRanking: vi.fn(),
      getPlayerRanking: vi.fn(),
    };

    controller = new PlayersController(mockPlayerService as unknown as PlayersRanking);
  });

  it('should get ranking', async () => {
    // Given
    const date = '2024-01-01';
    const mockPlayers: PlayerRankingView[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        ranking: 1,
      },
    ];

    mockPlayerService.getDailyRanking.mockResolvedValue(mockPlayers);

    // When
    const result = await controller.getRanking(date);

    // Then
    expect(result).toEqual(mockPlayers);
    expect(mockPlayerService.getDailyRanking).toHaveBeenCalledWith(date);
  });

  it('should get player ranking', async () => {
    // Given
    const login = 'player_001';
    const days = '356';
    const mockPlayers: PlayerRankingView[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        ranking: 1,
      },
    ];

    mockPlayerService.getPlayerRanking.mockResolvedValue(mockPlayers);

    // When
    const result = await controller.getPlayerRanking(login, days);

    // Then
    expect(result).toEqual(mockPlayers);
    expect(mockPlayerService.getPlayerRanking).toHaveBeenCalledWith(login, 356);
  });
});

