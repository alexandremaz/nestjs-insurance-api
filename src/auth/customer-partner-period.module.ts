import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPartnerPeriod } from '../customer/customer-partner-period.entity.js';
import { CustomerPartnerPeriodService } from './customer-partner-period.service.js';

@Module({
  controllers: [],
  exports: [CustomerPartnerPeriodService],
  imports: [TypeOrmModule.forFeature([CustomerPartnerPeriod])],
  providers: [CustomerPartnerPeriodService],
})
export class CustomerPartnerPeriodModule {}
