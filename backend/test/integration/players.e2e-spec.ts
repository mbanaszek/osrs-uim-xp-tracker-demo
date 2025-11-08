import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../src/players/domain/player.entity';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('PlayersController (e2e)', () => {
  let app: INestApplication;
  let playerRepository: Repository<Player>;

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
  });

  beforeEach(async () => {
    // Clear database before each test
    await playerRepository.clear();

    // Insert test data
    const testPlayers: Player[] = [
      {
        id: 1,
        login: 'player_001',
        date: '2024-01-01',
        experience: 50000,
        rankingChange: 10,
      } as Player,
      {
        id: 2,
        login: 'player_001',
        date: '2024-01-02',
        experience: 51000,
        rankingChange: 15,
      } as Player,
      {
        id: 3,
        login: 'player_002',
        date: '2024-01-01',
        experience: 60000,
        rankingChange: -5,
      } as Player,
    ];

    await playerRepository.save(testPlayers);
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
  });
});

