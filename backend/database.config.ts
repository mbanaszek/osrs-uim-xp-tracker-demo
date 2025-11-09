import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Player } from './src/players/player.entity';
import { PlayerRankingPerDay } from './src/players/player-ranking-per-day.entity';

const dataDir = path.resolve(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const dataSource = new DataSource({
  type: 'sqlite',
  database: path.join(dataDir, 'database.sqlite'),
  entities: [Player, PlayerRankingPerDay],
  synchronize: true,
  logging: false,
});
export default dataSource;

