import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Stations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new gas station' })
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.stationsService.create(body, user.id);
  }

  @Get('my-stations')
  @ApiOperation({ summary: 'Get all stations for the logged-in owner' })
  findMyStations(@CurrentUser() user: any) {
    return this.stationsService.findByOwner(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.stationsService.update(id, body);
  }

  @Put(':id/price')
  @ApiOperation({ summary: 'Update gas price per kg for a station' })
  updatePrice(@Param('id') id: string, @Body() body: { pricePerKg: number }) {
    return this.stationsService.updatePrice(id, body.pricePerKg);
  }
}
