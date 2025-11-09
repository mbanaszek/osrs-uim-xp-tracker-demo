import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayersRanking, PlayerRankingView } from './players-ranking';
import { PlayerRankingPerDay } from './player-ranking-per-day.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Players rankings', () => {
  let service: PlayersRanking;

  const mockRepository = {
    find: vi.fn(),
  };

  beforeEach(async () => {
    // Given
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersRanking,
        {
          provide: getRepositoryToken(PlayerRankingPerDay),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlayersRanking>(PlayersRanking);
  });

  it('should get daily ranking', async () => {
    // Given
    const date = '2024-01-01';
    const mockRankings: PlayerRankingPerDay[] = [
      {
        id: 1,
        player: { id: 1, login: 'player_001', rankings: [] } as any,
        date: '2024-01-01',
        experience: 50000,
        ranking: 1,
      } as PlayerRankingPerDay,
    ];

    mockRepository.find.mockResolvedValue(mockRankings);

    // When
    const result = await service.getDailyRanking(date);

    // Then
    const expected: PlayerRankingView[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        ranking: 1,
      },
    ];
    expect(result).toEqual(expected);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { date },
      relations: ['player'],
      order: { ranking: 'ASC' },
      take: 50,
    });
  });

  it('should get player ranking', async () => {
    // Given
    const login = 'player_001';
    const days = 356;
    const mockRankings: PlayerRankingPerDay[] = [
      {
        id: 1,
        player: { id: 1, login: 'player_001', rankings: [] } as any,
        date: '2024-01-01',
        experience: 50000,
        ranking: 5,
      } as PlayerRankingPerDay,
    ];

    mockRepository.find.mockResolvedValue(mockRankings);

    // When
    const result = await service.getPlayerRanking(login, days);

    // Then
    expect(result).toEqual([
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        ranking: 5,
      },
    ]);
    expect(mockRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          player: { login },
        }),
        relations: ['player'],
        order: { date: 'DESC' },
      }),
    );
  });
});

