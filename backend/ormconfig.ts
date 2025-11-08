import { DataSource } from 'typeorm';
import { Player } from './src/players/domain/player.entity';

export default new DataSource({
  type: 'sqlite',
  database: './data/database.sqlite',
  entities: [Player],
  synchronize: true,
  logging: false,
});

