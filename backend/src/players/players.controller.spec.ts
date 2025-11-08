import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayerService } from './domain/player.service';
import { Player } from './domain/player.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayerService;

  const mockPlayerService = {
    getDailyRanking: vi.fn(),
    getPlayerRanking: vi.fn(),
  };

  beforeEach(async () => {
    // Given
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    // Then
    expect(controller).toBeDefined();
  });

  it('should get ranking', async () => {
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
    const mockPlayers: Player[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
      } as Player,
    ];

    mockPlayerService.getPlayerRanking.mockResolvedValue(mockPlayers);

    // When
    const result = await controller.getPlayerRanking(login, days);

    // Then
    expect(result).toEqual(mockPlayers);
    expect(mockPlayerService.getPlayerRanking).toHaveBeenCalledWith(login, 356);
  });
});

