import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../src/players/player.entity';
import { PlayerRankingPerDay } from '../../src/players/player-ranking-per-day.entity';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('PlayersController (e2e)', () => {
  let app: INestApplication;
  let playerRepository: Repository<Player>;
  let rankingRepository: Repository<PlayerRankingPerDay>;

  beforeAll(async () => {
    // Given
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    await app.init();

    playerRepository = moduleFixture.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
    rankingRepository = moduleFixture.get<Repository<PlayerRankingPerDay>>(
      getRepositoryToken(PlayerRankingPerDay),
    );
  });

  beforeEach(async () => {
    // Clear database before each test
    await rankingRepository.clear();
    await playerRepository.clear();

    // Insert test data
    const playerOne = await playerRepository.save(
      playerRepository.create({ login: 'player_001' }),
    );
    const playerTwo = await playerRepository.save(
      playerRepository.create({ login: 'player_002' }),
    );

    const rankings: PlayerRankingPerDay[] = [
      rankingRepository.create({
        player: playerOne,
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
        ranking: 2,
      }),
      rankingRepository.create({
        player: playerOne,
        date: '2024-01-02',
        experience: 51000,
        rankingChange: 15,
        ranking: 1,
      }),
      rankingRepository.create({
        player: playerTwo,
        date: '2024-01-01',
        experience: 60000,
        rankingChange: -5,
        ranking: 1,
      }),
    ];

    await rankingRepository.save(rankings);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ranking (GET) should return daily ranking', async () => {
    // Given
    const date = '2024-01-01';

    // When
    const response = await request(app.getHttpServer())
      .get(`/ranking?date=${date}`)
      .expect(200);

    // Then
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('login');
    expect(response.body[0]).toHaveProperty('experience');
    expect(response.body[0]).toHaveProperty('rankingChange');
    expect(response.body[0]).toHaveProperty('ranking');
  });

  it('/player/ranking/:login (GET) should return player ranking history', async () => {
    // Given
    const login = 'player_001';
    const days = 356;

    // When
    const response = await request(app.getHttpServer())
      .get(`/player/ranking/${login}?days=${days}`)
      .expect(200);

    // Then
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].login).toBe(login);
    expect(response.body[0]).toHaveProperty('date');
    expect(response.body[0]).toHaveProperty('experience');
    expect(response.body[0]).toHaveProperty('rankingChange');
    expect(response.body[0]).toHaveProperty('ranking');
  });
});

