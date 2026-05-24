import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getStationStaff(stationId: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      where: { stationId },
      order: { createdAt: 'ASC' },
    });
    return users.map(({ password, ...u }) => u);
  }

  async createStaff(dto: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: UserRole;
    stationId: string;
    password: string;
  }, ownerUserId: string) {
    // Verify the station belongs to this owner
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = new User();
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.phone = dto.phone || '';
    user.password = hashed;
    user.role = dto.role;
    user.stationId = dto.stationId;
    user.isActive = true;

    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async toggleActive(userId: string, stationId: string): Promise<{ isActive: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId, stationId } });
    if (!user) throw new NotFoundException('Staff member not found');
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { isActive: user.isActive };
  }

  async resetPassword(userId: string, stationId: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId, stationId } });
    if (!user) throw new NotFoundException('Staff member not found');
    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }

  async deleteStaff(userId: string, stationId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId, stationId } });
    if (!user) throw new NotFoundException('Staff member not found');
    if (user.role === UserRole.OWNER) throw new ForbiddenException('Cannot delete owner account');
    await this.userRepository.remove(user);
    return { message: 'Staff member removed' };
  }
}
