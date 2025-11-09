import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersController } from './players.controller';
import { PlayersRanking } from '../../players/players-ranking';
import { Player } from '../../players/player.entity';
import { PlayerRankingPerDay } from '../../players/player-ranking-per-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, PlayerRankingPerDay])],
  controllers: [PlayersController],
  providers: [PlayersRanking],
})
export class PlayersModule {}

