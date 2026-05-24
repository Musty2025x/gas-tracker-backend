import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StockMovement, StockType } from './stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement)
    private stockRepository: Repository<StockMovement>,
  ) {}

  async recordDelivery(dto: Partial<StockMovement>, userId: string): Promise<StockMovement> {
    const movement = this.stockRepository.create({
      ...dto,
      type: StockType.DELIVERY,
      recordedByUserId: userId,
    });
    return this.stockRepository.save(movement);
  }

  async findByStation(stationId: string, from?: string, to?: string): Promise<StockMovement[]> {
    const where: any = { stationId };
    if (from && to) where.movementDate = Between(from, to);
    return this.stockRepository.find({ where, order: { movementDate: 'DESC' } });
  }

  async getCurrentStock(stationId: string): Promise<{ totalDeliveredKg: number; note: string }> {
    const movements = await this.stockRepository.find({ where: { stationId } });
    const totalDeliveredKg = movements.reduce((sum, m) => sum + Number(m.quantityKg), 0);
    return {
      totalDeliveredKg,
      note: 'Calculate remaining stock = total delivered - total sold (from entries)',
    };
  }
}
