import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EntriesService } from './entries.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Entry } from './entry.entity';

@ApiTags('Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('entries')
export class EntriesController {
  constructor(private entriesService: EntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a daily meter entry' })
  create(@Body() body: Partial<Entry>, @CurrentUser() user: any) {
    return this.entriesService.create(body, user.id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Bulk sync offline entries from mobile app' })
  bulkSync(@Body() body: { entries: Partial<Entry>[] }, @CurrentUser() user: any) {
    return this.entriesService.bulkSync(body.entries, user.id);
  }

  @Get('station/:stationId')
  @ApiOperation({ summary: 'Get entries for a station with optional date range' })
  findByStation(
    @Param('stationId') stationId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.entriesService.findByStation(stationId, from, to);
  }

  @Get('station/:stationId/summary')
  @ApiOperation({ summary: 'Get daily summary for a station' })
  getDailySummary(
    @Param('stationId') stationId: string,
    @Query('date') date: string,
  ) {
    return this.entriesService.getDailySummary(stationId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('stationId') stationId: string) {
    return this.entriesService.findOne(id, stationId);
  }
}
