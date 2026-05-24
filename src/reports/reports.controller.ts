import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('station/:stationId/daily')
  @ApiOperation({ summary: 'Get daily report for a station' })
  getDailyReport(
    @Param('stationId') stationId: string,
    @Query('date') date: string,
  ) {
    return this.reportsService.getDailyReport(stationId, date);
  }

  @Get('station/:stationId/weekly')
  @ApiOperation({ summary: 'Get weekly/range report for a station' })
  getWeeklyReport(
    @Param('stationId') stationId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.getWeeklyReport(stationId, from, to);
  }
}
