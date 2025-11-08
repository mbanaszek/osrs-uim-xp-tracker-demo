import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getDailyRanking(date: string): Promise<Player[]> {
    // Given
    const targetDate = date || new Date().toISOString().split('T')[0];

    // When
    const players = await this.playerRepository.find({
      where: { date: targetDate },
      order: { experience: 'DESC' },
      take: 50,
    });

    // Then
    return players;
  }

  async getPlayerRanking(login: string, days: number): Promise<Player[]> {
    // Given
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // When
    const players = await this.playerRepository.find({
      where: { login },
      order: { date: 'ASC' },
    });

    // Then
    return players.filter(
      (player) => player.date >= startDateStr && player.date <= endDateStr,
    );
  }
}

