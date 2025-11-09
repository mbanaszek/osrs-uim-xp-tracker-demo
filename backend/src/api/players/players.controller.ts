import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PlayersRanking, PlayerRankingView } from '../../players/players-ranking';

@ApiTags('players')
@Controller()
export class PlayersController {
  constructor(private readonly playersRanking: PlayersRanking) {}

  @Get('ranking')
  @ApiOperation({ summary: 'Get daily ranking of top 50 players' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Date in YYYY-MM-DD format. Defaults to today.',
  })
  async getRanking(@Query('date') date?: string): Promise<PlayerRankingView[]> {
    const result = await this.playersRanking.getDailyRanking(date || '');
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
  ): Promise<PlayerRankingView[]> {
    const daysNumber = days ? parseInt(days, 10) : 356;
    const result = await this.playersRanking.getPlayerRanking(login, daysNumber);
    return result;
  }
}

