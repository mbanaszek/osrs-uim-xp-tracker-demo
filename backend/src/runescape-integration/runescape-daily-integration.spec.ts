import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { DataSource, Repository } from 'typeorm';
import { RunescapeDailyIntegration } from './runescape-daily-integration';
import { Player } from '@/players-ranking/player.entity';
import { PlayerRankingPerDay } from '@/players-ranking/player-ranking-per-day.entity';
import { mapDateToDateString } from '@/utils/date-formatter';

vi.mock('cheerio', async () => {
  const actual = await vi.importActual<typeof import('cheerio')>('cheerio');
  return actual;
});

interface MockConfig {
  page1Rows: string[][];
  page2Rows?: string[][];
  indexLite?: { status: number; body?: string };
}

function mockLeaderboardRequest(
  mock: ReturnType<typeof vi.spyOn>,
  { page1Rows, page2Rows = [], indexLite }: MockConfig,
): void {
  mock.mockImplementation(async (url: string) => {
    if (url.includes('page=1')) {
      return {
        data: sampleLeaderboardHtml(page1Rows),
        status: 200,
      } as any;
    }
    if (url.includes('page=2')) {
      return {
        data: sampleLeaderboardHtml(page2Rows),
        status: 200,
      } as any;
    }
    if (url.includes('index_lite')) {
      if (!indexLite) {
        return { status: 404 } as any;
      }
      return {
        data: indexLite.body,
        status: indexLite.status,
      } as any;
    }
    throw new Error(`Unexpected URL ${url}`);
  });
}

function sampleLeaderboardHtml(rows: string[][]): string {
  const bodyRows = rows
    .map(
      ([rank, name, level, xp]) =>
        `<tr><td>${rank}</td><td>${name}</td><td>${level}</td><td>${xp}</td></tr>`,
    )
    .join('');
  return `<html><body><table><tbody>${bodyRows}</tbody></table></body></html>`;
}

describe('RunescapeDailyIntegration (with sqlite)', () => {
  let dataSource: DataSource;
  let playerRepository: Repository<Player>;
  let rankingRepository: Repository<PlayerRankingPerDay>;
  let service: RunescapeDailyIntegration;
  let axiosGetMock: ReturnType<typeof vi.spyOn>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [Player, PlayerRankingPerDay],
      synchronize: true,
    });
    await dataSource.initialize();

    playerRepository = dataSource.getRepository(Player);
    rankingRepository = dataSource.getRepository(PlayerRankingPerDay);

    service = new RunescapeDailyIntegration(dataSource, playerRepository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    axiosGetMock = vi.spyOn(axios, 'get');
    await rankingRepository.clear();
    await playerRepository.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should persist leaderboard rankings into the database', async () => {
    // Given
    mockLeaderboardRequest(axiosGetMock, {
      page1Rows: [
        ['1', 'Player 1', '2277', '12,345'],
        ['2', 'Player 2', '2277', '11,000'],
      ],
      page2Rows: [],
    });

    const targetDate = new Date('2025-11-09T10:00:00Z');

    // When
    await service.fetchUltimateIronmanLeaderboardForDate(targetDate);

    // Then
    const players = await playerRepository.find({ order: { login: 'ASC' } });
    expect(players).toHaveLength(2);
    expect(players.map((p) => p.login)).toEqual(['Player 1', 'Player 2']);

    const rankings = await rankingRepository.find({
      relations: ['player'],
      order: { ranking: 'ASC' },
    });
    expect(rankings).toHaveLength(2);
    expect(rankings[0]).toMatchObject({
      date: '2025-11-09',
      ranking: 1,
      experience: 12345,
      player: { login: 'Player 1' },
    });
    expect(rankings[1]).toMatchObject({
      date: '2025-11-09',
      ranking: 2,
      experience: 11000,
      player: { login: 'Player 2' },
    });

  });

  it('should update rankings for players outside the top 50', async () => {
    // Given
    await playerRepository.save(playerRepository.create({ login: 'Existing Player' }));

    mockLeaderboardRequest(axiosGetMock, {
      page1Rows: [['1', 'Top Player', '2277', '99,999']],
      page2Rows: [],
      indexLite: { status: 200, body: '0,0,54321\n' },
    });

    // When
    await service.fetchUltimateIronmanLeaderboardForDate(new Date('2025-11-09'));

    // Then
    const outsideRanking = await rankingRepository.findOne({
      where: { date: '2025-11-09', player: { login: 'Existing Player' } },
      relations: ['player'],
    });
    expect(outsideRanking).toMatchObject({
      date: '2025-11-09',
      ranking: null,
      experience: 54321,
      player: { login: 'Existing Player' },
    });
  });

  it('should default to today when fetching current leaderboard', async () => {
    // Given
    const today = mapDateToDateString(new Date());
    mockLeaderboardRequest(axiosGetMock, {
      page1Rows: [['1', 'Today Player', '2277', '10,001']],
      page2Rows: [],
      indexLite: { status: 200, body: '0,0,11111\n' },
    });

    // When
    await service.fetchUltimateIronmanLeaderboardToday();

    // Then
    const ranking = await rankingRepository.findOne({
      where: { date: today },
      relations: ['player'],
    });
    expect(ranking).toBeTruthy();
    expect(ranking?.ranking).toBe(1);
  });
});
