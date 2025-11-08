import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  const mockRepository = {
    find: vi.fn(),
  };

  beforeEach(async () => {
    // Given
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    // Then
    expect(service).toBeDefined();
  });

  it('should get daily ranking', async () => {
    // Given
    const date = '2024-01-01';
    const mockPlayers: Player[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
      } as Player,
    ];

    mockRepository.find.mockResolvedValue(mockPlayers);

    // When
    const result = await service.getDailyRanking(date);

    // Then
    expect(result).toEqual(mockPlayers);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { date },
      order: { experience: 'DESC' },
      take: 50,
    });
  });

  it('should get player ranking', async () => {
    // Given
    const login = 'player_001';
    const days = 356;
    const mockPlayers: Player[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
      } as Player,
    ];

    mockRepository.find.mockResolvedValue(mockPlayers);

    // When
    const result = await service.getPlayerRanking(login, days);

    // Then
    expect(result).toBeDefined();
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { login },
      order: { date: 'ASC' },
    });
  });
});

