import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from './user.entity';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('station/:stationId')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all staff for a station' })
  getStaff(@Param('stationId') stationId: string) {
    return this.usersService.getStationStaff(stationId);
  }

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Add a new staff member' })
  createStaff(@Body() body: any, @CurrentUser() user: any) {
    return this.usersService.createStaff(body, user.id);
  }

  @Put(':userId/toggle-active')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Activate or deactivate a staff member' })
  toggleActive(@Param('userId') userId: string, @Body() body: { stationId: string }) {
    return this.usersService.toggleActive(userId, body.stationId);
  }

  @Put(':userId/reset-password')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Reset staff member password' })
  resetPassword(
    @Param('userId') userId: string,
    @Body() body: { stationId: string; newPassword: string },
  ) {
    return this.usersService.resetPassword(userId, body.stationId, body.newPassword);
  }

  @Delete(':userId')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Remove a staff member' })
  deleteStaff(@Param('userId') userId: string, @Body() body: { stationId: string }) {
    return this.usersService.deleteStaff(userId, body.stationId);
  }
}
