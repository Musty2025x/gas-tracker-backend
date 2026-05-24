import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(dto: Partial<Expense>, userId: string): Promise<Expense> {
    const expense = this.expenseRepository.create({ ...dto, recordedByUserId: userId });
    return this.expenseRepository.save(expense);
  }

  async findByStation(stationId: string, from?: string, to?: string): Promise<Expense[]> {
    const where: any = { stationId };
    if (from && to) where.expenseDate = Between(from, to);
    return this.expenseRepository.find({ where, order: { expenseDate: 'DESC' } });
  }

  async getTotalByStation(stationId: string, from: string, to: string): Promise<number> {
    const expenses = await this.findByStation(stationId, from, to);
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }
}
