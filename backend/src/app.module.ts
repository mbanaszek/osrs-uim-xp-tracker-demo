import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './api/players/players.module';
import { dataSource } from '../database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
    }),
    PlayersModule,
  ],
})
export class AppModule {}

