import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { Player } from './players/domain/player.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/database.sqlite',
      entities: [Player],
      synchronize: true,
      logging: false,
    }),
    PlayersModule,
  ],
})
export class AppModule {}

