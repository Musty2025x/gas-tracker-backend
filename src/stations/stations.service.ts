import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async create(dto: Partial<Station>, ownerUserId: string): Promise<Station> {
    const station = this.stationRepository.create({ ...dto, ownerUserId });
    return this.stationRepository.save(station);
  }

  async findByOwner(ownerUserId: string): Promise<Station[]> {
    return this.stationRepository.find({ where: { ownerUserId, isActive: true } });
  }

  async findOne(id: string): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) throw new NotFoundException('Station not found');
    return station;
  }

  async update(id: string, dto: Partial<Station>): Promise<Station> {
    await this.stationRepository.update(id, dto);
    return this.findOne(id);
  }

  async updatePrice(id: string, pricePerKg: number): Promise<Station> {
    return this.update(id, { pricePerKg });
  }
}
