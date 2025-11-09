import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import axios from 'axios';
import { load } from 'cheerio';
import { Player } from '@/players-ranking/player.entity';
import { PlayerRankingPerDay } from '@/players-ranking/player-ranking-per-day.entity';
import { mapDateToDateString } from '@/utils/date-formatter';

interface LeaderboardEntry {
  ranking: number;
  login: string;
  experience: number;
}

interface PlayerExperience {
  login: string;
  experience: number;
}

@Injectable()
export class RunescapeDailyIntegration {
  private readonly logger = new Logger(RunescapeDailyIntegration.name);

  private static readonly LEADERBOARD_URL =
    'https://secure.runescape.com/m=hiscore_oldschool_ultimate/overall?table=0&page=';

  private static readonly INDIVIDUAL_URL =
    'https://secure.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=';

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async fetchUltimateIronmanLeaderboardToday(): Promise<void> {
    await this.fetchUltimateIronmanLeaderboardForDate(new Date());
  }

  async fetchUltimateIronmanLeaderboardForDate(date: Date): Promise<void> {
    const dateString = mapDateToDateString(date);
    this.logger.log(`Starting leaderboard sync for ${dateString}`);

    try {
      const topEntries = await this.fetchTopLeaderboardEntries();
      await this.persistTopLeaderboard(dateString, topEntries);

      const outsideTopExperiences = await this.collectTrackedPlayersNotInTop50(topEntries);
      await this.persistOutsideTopPlayers(dateString, outsideTopExperiences);

      this.logger.log(`Leaderboard sync for ${dateString} completed.`);
    } catch (error) {
      this.logger.error(`Failed to complete leaderboard sync for ${dateString}`, error as Error);
      throw error;
    }
  }

  private async fetchTopLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    try {
      const pages = [1, 2];
      const entries: LeaderboardEntry[] = [];

      for (const page of pages) {
        const response = await axios.get<string>(
          `${RunescapeDailyIntegration.LEADERBOARD_URL}${page}`,
        );
        const $ = load(response.data);
        $('table tbody tr').each((index, element) => {
          if (entries.length >= 50) {
            return false;
          }
          const cells = $(element).find('td');
          if (cells.length < 4) {
            return;
          }
          const rank = parseInt($(cells[0]).text().trim(), 10);
          const login = this.normalizeLogin($(cells[1]).text());
          const xpCell = cells[cells.length - 1];
          const xpText = $(xpCell).text().replace(/,/g, '').trim();
          const experience = Number(xpText);
          if (!login || Number.isNaN(rank) || Number.isNaN(experience)) {
            return;
          }
          entries.push({ ranking: rank, login, experience });
        });

        if (entries.length >= 50) {
          break;
        }
      }

      return entries.slice(0, 50);
    } catch (error) {
      this.logger.error('Failed to fetch leaderboard page', error as Error);
      throw error;
    }
  }

  private async collectTrackedPlayersNotInTop50(
    topEntries: LeaderboardEntry[],
  ): Promise<PlayerExperience[]> {
    const topLogins = new Set(topEntries.map((entry) => entry.login));
    const existingPlayers = await this.playerRepository.find({ select: ['id', 'login'] });
    const outsideTopLogins = existingPlayers
      .map((player) => player.login)
      .filter((login) => !topLogins.has(login));

    if (!outsideTopLogins.length) {
      return [];
    }

    return this.fetchExperiencesForLogins(outsideTopLogins);
  }

  private async fetchExperiencesForLogins(logins: string[]): Promise<PlayerExperience[]> {
    const results: PlayerExperience[] = [];
    for (const login of logins) {
      try {
        const experience = await this.fetchPlayerExperience(login);
        if (experience !== null) {
          results.push({ login, experience });
        }
      } catch (error) {
        this.logger.warn(`Failed to fetch experience for ${login}: ${(error as Error).message}`);
      }
    }
    return results;
  }

  private async persistTopLeaderboard(
    date: string,
    entries: LeaderboardEntry[],
  ): Promise<void> {
    if (!entries.length) {
      this.logger.warn('No entries received for top 50 leaderboard.');
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const playerRepo = manager.getRepository(Player);
      const rankingRepo = manager.getRepository(PlayerRankingPerDay);

      const playersByLogin = await this.ensurePlayers(playerRepo, entries.map((entry) => entry.login));

      for (const entry of entries) {
        const player = playersByLogin.get(entry.login);
        if (!player) {
          continue;
        }

        await this.saveRankingRecord(
          rankingRepo,
          player,
          date,
          entry.experience,
          entry.ranking,
        );
      }
    });
  }

  private async persistOutsideTopPlayers(
    date: string,
    experiences: PlayerExperience[],
  ): Promise<void> {
    if (!experiences.length) {
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const playerRepo = manager.getRepository(Player);
      const rankingRepo = manager.getRepository(PlayerRankingPerDay);

      const logins = experiences.map((item) => item.login);
      const players = logins.length
        ? await playerRepo.find({ where: { login: In(logins) } })
        : [];
      const playersByLogin = new Map(players.map((player) => [player.login, player] as const));

      for (const { login, experience } of experiences) {
        const player = playersByLogin.get(login);
        if (!player) {
          continue;
        }

        await this.saveRankingRecord(rankingRepo, player, date, experience, null);
      }
    });
  }

  private async ensurePlayers(
    playerRepo: Repository<Player>,
    logins: string[],
  ): Promise<Map<string, Player>> {
    const uniqueLogins = Array.from(new Set(logins));
    const playersByLogin = new Map<string, Player>();

    if (!uniqueLogins.length) {
      return playersByLogin;
    }

    const existingPlayers = await playerRepo.find({ where: { login: In(uniqueLogins) } });
    existingPlayers.forEach((player) => playersByLogin.set(player.login, player));

    for (const login of uniqueLogins) {
      if (playersByLogin.has(login)) {
        continue;
      }
      const created = await playerRepo.save(playerRepo.create({ login }));
      playersByLogin.set(created.login, created);
    }

    return playersByLogin;
  }

  private async fetchPlayerExperience(login: string): Promise<number | null> {
    const url = `${RunescapeDailyIntegration.INDIVIDUAL_URL}${encodeURIComponent(login)}`;
    const response = await axios.get<string>(url, { validateStatus: () => true });
    if (response.status !== 200 || !response.data) {
      return null;
    }
    const firstLine = response.data.split('\n')[0];
    const [, , xpStr] = firstLine.split(',');
    if (!xpStr) {
      return null;
    }
    const experience = Number(xpStr.trim());
    return Number.isNaN(experience) ? null : experience;
  }

  private async saveRankingRecord(
    rankingRepo: Repository<PlayerRankingPerDay>,
    player: Player,
    date: string,
    experience: number,
    ranking: number | null,
  ): Promise<void> {
    const existing = await rankingRepo.findOne({
      where: { player: { id: player.id }, date },
    });

    if (existing) {
      existing.experience = experience;
      existing.ranking = ranking;
      await rankingRepo.save(existing);
    } else {
      const record = rankingRepo.create({
        player,
        date,
        experience,
        ranking,
      });
      await rankingRepo.save(record);
    }
  }

  private normalizeLogin(raw: string): string {
    return raw.replace(/\u00a0/g, ' ').trim();
  }
}
