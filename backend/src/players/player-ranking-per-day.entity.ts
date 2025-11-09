import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Player } from './player.entity';

@Entity('player_rankings_per_day')
@Index(['player', 'date'], { unique: true })
export class PlayerRankingPerDay {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.rankings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  player: Player;

  @Column('date')
  @Index()
  date: string;

  @Column('integer')
  experience: number;

  @Column('integer')
  ranking: number;

  @Column('integer', { name: 'ranking_change', nullable: true })
  rankingChange: number;
}
