import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './api/players/players.module';
import { dataSource } from '../database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { RunescapeIntegrationModule } from './runescape-integration/runescape-integration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
    }),
    ScheduleModule.forRoot(),
    PlayersModule,
    RunescapeIntegrationModule,
  ],
})
export class AppModule {}

