import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { PlayerRankingPerDay } from './player-ranking-per-day.entity';
import { mapDateToDateString } from '@/utils/date-formatter';

export interface PlayerRankingView {
  id: number;
  login: string;
  date: string;
  experience: number;
  ranking: number | null;
}

@Injectable()
export class PlayersRanking {
  constructor(
    @InjectRepository(PlayerRankingPerDay)
    private playerRankingRepository: Repository<PlayerRankingPerDay>,
  ) {}

  async getDailyRanking(date: string): Promise<PlayerRankingView[]> {
    const targetDate = date || mapDateToDateString(new Date());

    const rankings = await this.playerRankingRepository.find({
      where: { date: targetDate },
      relations: ['player'],
      order: { ranking: 'ASC' },
      take: 50,
    });

    return rankings.map((ranking) => this.toView(ranking));
  }

  async getPlayerRanking(
    login: string,
    days: number,
  ): Promise<PlayerRankingView[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const rankings = await this.playerRankingRepository.find({
      where: {
        player: { login },
        date: Between(startDateStr, endDateStr),
      },
      relations: ['player'],
      order: { date: 'DESC' },
    });

    return rankings.map((ranking) => this.toView(ranking));
  }

  private toView(ranking: PlayerRankingPerDay): PlayerRankingView {
    return {
      id: ranking.id,
      login: ranking.player.login,
      date: ranking.date,
      experience: ranking.experience,
      ranking: ranking.ranking ?? null,
    };
  }
}

