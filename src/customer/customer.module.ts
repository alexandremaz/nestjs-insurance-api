import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Claim } from '../claim/claim.entity';
import { CustomerPartnerPeriod } from './customer-partner-period.entity';
import { Partner } from '../auth/entities/partner.entity';
import { CustomerPartnerPeriodService } from '../auth/customer-partner-period.service';

// Module to handle the customers
@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Claim, CustomerPartnerPeriod, Partner]),
  ],
  providers: [CustomerService, CustomerPartnerPeriodService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
