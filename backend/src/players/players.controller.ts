import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PlayerService } from './domain/player.service';
import { Player } from './domain/player.entity';

@ApiTags('players')
@Controller()
export class PlayersController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('ranking')
  @ApiOperation({ summary: 'Get daily ranking of top 50 players' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Date in YYYY-MM-DD format. Defaults to today.',
  })
  async getRanking(@Query('date') date?: string): Promise<Player[]> {
    // Given
    // When
    const result = await this.playerService.getDailyRanking(date || '');

    // Then
    return result;
  }

  @Get('player/ranking/:login')
  @ApiOperation({ summary: 'Get player ranking history' })
  @ApiParam({ name: 'login', type: String })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to retrieve. Defaults to 356.',
  })
  async getPlayerRanking(
    @Param('login') login: string,
    @Query('days') days?: string,
  ): Promise<Player[]> {
    // Given
    const daysNumber = days ? parseInt(days, 10) : 356;

    // When
    const result = await this.playerService.getPlayerRanking(login, daysNumber);

    // Then
    return result;
  }
}

