import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  login: string;

  @Column('date')
  @Index()
  date: string;

  @Column('integer')
  experience: number;

  @Column('integer', { name: 'ranking_change' })
  rankingChange: number;
}

