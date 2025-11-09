import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RunescapeDailyIntegration } from './runescape-daily-integration';

@Injectable()
export class RunescapeIntegrationScheduler {
  private readonly logger = new Logger(RunescapeIntegrationScheduler.name);

  constructor(
    private readonly dailyIntegrationService: RunescapeDailyIntegration,
  ) {}

  @Cron('0 2 * * *', { timeZone: 'Europe/Warsaw' })
  async handleDailyLeaderboardSync(): Promise<void> {
    this.logger.log('Running daily Ultimate Ironman leaderboard sync.');
    await this.dailyIntegrationService.fetchUltimateIronmanLeaderboardToday();
  }
}
