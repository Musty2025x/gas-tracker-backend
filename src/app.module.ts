import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StationsModule } from './stations/stations.module';
import { EntriesModule } from './entries/entries.module';
import { StockModule } from './stock/stock.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    StationsModule,
    EntriesModule,
    StockModule,
    ExpensesModule,
    ReportsModule,
  ],
})
export class AppModule {}
