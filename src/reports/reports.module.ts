import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { EntriesModule } from '../entries/entries.module';
import { StockModule } from '../stock/stock.module';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [EntriesModule, StockModule, ExpensesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
