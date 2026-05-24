import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Entry } from './entry.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
  ) {}

  async create(dto: Partial<Entry>, userId: string): Promise<Entry> {
    // Calculate derived fields
    const totalSalesKg = Number(dto.closingMeter) - Number(dto.openingMeter);
    const expectedRevenue = totalSalesKg * Number(dto.pricePerKg);
    const totalRemitted = Number(dto.cashReceived || 0) + Number(dto.posReceived || 0);
    const variance = totalRemitted - expectedRevenue;

    const entry = this.entryRepository.create({
      ...dto,
      attendantUserId: userId,
      totalSalesKg,
      expectedRevenue,
      totalRemitted,
      variance,
      isSynced: true,
    });

    return this.entryRepository.save(entry);
  }

  // Bulk sync from offline mobile app
  async bulkSync(entries: Partial<Entry>[], userId: string): Promise<Entry[]> {
    const results: Entry[] = [];
    for (const dto of entries) {
      // Skip if already synced (check by localId)
      if (dto.localId) {
        const exists = await this.entryRepository.findOne({ where: { localId: dto.localId } });
        if (exists) { results.push(exists); continue; }
      }
      results.push(await this.create(dto, userId));
    }
    return results;
  }

  async findByStation(stationId: string, from?: string, to?: string): Promise<Entry[]> {
    const where: any = { stationId };
    if (from && to) {
      where.entryDate = Between(from, to);
    }
    return this.entryRepository.find({
      where,
      order: { entryDate: 'DESC' },
    });
  }

  async findOne(id: string, stationId: string): Promise<Entry> {
    const entry = await this.entryRepository.findOne({ where: { id, stationId } });
    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }

  async getDailySummary(stationId: string, date: string) {
    const entries = await this.entryRepository.find({ where: { stationId, entryDate: date } });
    return {
      date,
      totalSalesKg: entries.reduce((sum, e) => sum + Number(e.totalSalesKg), 0),
      expectedRevenue: entries.reduce((sum, e) => sum + Number(e.expectedRevenue), 0),
      totalRemitted: entries.reduce((sum, e) => sum + Number(e.totalRemitted), 0),
      totalVariance: entries.reduce((sum, e) => sum + Number(e.variance), 0),
      cashReceived: entries.reduce((sum, e) => sum + Number(e.cashReceived), 0),
      posReceived: entries.reduce((sum, e) => sum + Number(e.posReceived), 0),
      entryCount: entries.length,
    };
  }
}
