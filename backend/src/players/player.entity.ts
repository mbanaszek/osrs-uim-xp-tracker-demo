import 'reflect-metadata';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PlayerRankingPerDay } from './player-ranking-per-day.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  login: string;

  @OneToMany(() => PlayerRankingPerDay, (ranking) => ranking.player, {
    cascade: true,
  })
  rankings: PlayerRankingPerDay[];
}

