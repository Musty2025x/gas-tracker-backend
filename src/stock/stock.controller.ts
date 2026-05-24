import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Stock')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post('delivery')
  recordDelivery(@Body() body: any, @CurrentUser() user: any) {
    return this.stockService.recordDelivery(body, user.id);
  }

  @Get('station/:stationId')
  findByStation(
    @Param('stationId') stationId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.stockService.findByStation(stationId, from, to);
  }

  @Get('station/:stationId/current')
  getCurrentStock(@Param('stationId') stationId: string) {
    return this.stockService.getCurrentStock(stationId);
  }
}
