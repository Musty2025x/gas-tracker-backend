import { Injectable } from '@nestjs/common';
import { EntriesService } from '../entries/entries.service';
import { StockService } from '../stock/stock.service';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class ReportsService {
  constructor(
    private entriesService: EntriesService,
    private stockService: StockService,
    private expensesService: ExpensesService,
  ) {}

  async getDailyReport(stationId: string, date: string) {
    const summary = await this.entriesService.getDailySummary(stationId, date);
    const entries = await this.entriesService.findByStation(stationId, date, date);
    const expenses = await this.expensesService.findByStation(stationId, date, date);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      stationId,
      date,
      sales: summary,
      expenses: { items: expenses, total: totalExpenses },
      netProfit: summary.totalRemitted - totalExpenses,
      entries,
    };
  }

  async getWeeklyReport(stationId: string, from: string, to: string) {
    const entries = await this.entriesService.findByStation(stationId, from, to);
    const expenses = await this.expensesService.findByStation(stationId, from, to);
    const stockMovements = await this.stockService.findByStation(stationId, from, to);

    const totalSalesKg = entries.reduce((sum, e) => sum + Number(e.totalSalesKg), 0);
    const totalRevenue = entries.reduce((sum, e) => sum + Number(e.expectedRevenue), 0);
    const totalRemitted = entries.reduce((sum, e) => sum + Number(e.totalRemitted), 0);
    const totalVariance = entries.reduce((sum, e) => sum + Number(e.variance), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalStockDelivered = stockMovements.reduce((sum, s) => sum + Number(s.quantityKg), 0);

    return {
      stationId,
      period: { from, to },
      summary: {
        totalSalesKg,
        totalRevenue,
        totalRemitted,
        totalVariance,
        totalExpenses,
        netProfit: totalRemitted - totalExpenses,
        totalStockDelivered,
      },
      entries,
      expenses,
      stockMovements,
    };
  }
}
