import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersController } from './players.controller';
import { PlayersRanking } from '@/players-ranking/players-ranking';
import { Player } from '@/players-ranking/player.entity';
import { PlayerRankingPerDay } from '@/players-ranking/player-ranking-per-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, PlayerRankingPerDay])],
  controllers: [PlayersController],
  providers: [PlayersRanking],
})
export class PlayersModule {}

