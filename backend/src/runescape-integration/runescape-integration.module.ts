import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '@/players-ranking/player.entity';
import { PlayerRankingPerDay } from '@/players-ranking/player-ranking-per-day.entity';
import { RunescapeDailyIntegration } from './runescape-daily-integration';
import { RunescapeIntegrationScheduler } from './runescape-integration.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, PlayerRankingPerDay]),
  ],
  providers: [
    RunescapeDailyIntegration,
    RunescapeIntegrationScheduler,
  ],
  exports: [RunescapeDailyIntegration],
})
export class RunescapeIntegrationModule {}
