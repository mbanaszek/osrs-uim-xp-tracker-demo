import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';
import { Player } from '../players/domain/player.entity';

async function seed() {
  // Given
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dataSource = new DataSource({
    type: 'sqlite',
    database: path.join(dataDir, 'database.sqlite'),
    entities: [Player],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  const playerRepository = dataSource.getRepository(Player);

  // Clear existing data
  await playerRepository.clear();

  const totalPlayers = 100;
  const totalDays = 365;
  const players: Player[] = [];
  const startDate = dayjs().subtract(totalDays, 'days');
  const playerLogins = Array.from(
    { length: totalPlayers },
    (_, i) => `player_${String(i + 1).padStart(3, '0')}`,
  );

  // When
  for (let day = 0; day < totalDays; day++) {
    const currentDate = startDate.add(day, 'days').format('YYYY-MM-DD');
    const availablePlayers = [...playerLogins];

    // Randomly add new players (10% chance per day)
    if (Math.random() < 0.1 && day > 0) {
      const newPlayerLogin = `player_${String(
        totalPlayers + Math.floor(Math.random() * 50) + 1,
      ).padStart(3, '0')}`;
      if (!playerLogins.includes(newPlayerLogin)) {
        playerLogins.push(newPlayerLogin);
        availablePlayers.push(newPlayerLogin);
      }
    }

    // For each available player, randomly skip some days (30% chance)
    for (const login of availablePlayers) {
      if (Math.random() < 0.3 && day > 0) {
        continue; // Skip this day for this player
      }

      const baseExperience =
        Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
      const rankingChange = Math.floor(Math.random() * 101) - 50;

      const player = new Player();
      player.login = login;
      player.date = currentDate;
      player.experience = baseExperience;
      player.rankingChange = rankingChange;

      players.push(player);
    }
  }

  // Insert in batches
  const batchSize = 1000;
  for (let i = 0; i < players.length; i += batchSize) {
    const batch = players.slice(i, i + batchSize);
    await playerRepository.save(batch);
    console.log(
      `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        players.length / batchSize,
      )}`,
    );
  }

  // Then
  console.log(
    `✅ Seeded ${players.length} player records for ${totalPlayers} players over ${totalDays} days`,
  );
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});

