import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPartnerPeriod } from '../customer/customer-partner-period.entity';
import { CustomerPartnerPeriodService } from './customer-partner-period.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerPartnerPeriod])],
  providers: [CustomerPartnerPeriodService],
  controllers: [],
  exports: [CustomerPartnerPeriodService],
})
export class CustomerPartnerPeriodModule {}
