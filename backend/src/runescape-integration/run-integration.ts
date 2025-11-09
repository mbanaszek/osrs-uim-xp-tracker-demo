import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RunescapeDailyIntegration } from './runescape-daily-integration';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  try {
    const service = app.get(RunescapeDailyIntegration);
    await service.fetchUltimateIronmanLeaderboardToday();
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Failed to fetch leaderboard:', error);
  process.exit(1);
});
