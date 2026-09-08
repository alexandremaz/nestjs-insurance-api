import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPartnerPeriodService } from '../auth/customer-partner-period.service.js';
import { Partner } from '../auth/entities/partner.entity.js';
import { Claim } from '../claim/claim.entity.js';
import { CustomerController } from './customer.controller.js';
import { Customer } from './customer.entity.js';
import { CustomerService } from './customer.service.js';
import { CustomerPartnerPeriod } from './customer-partner-period.entity.js';

// Module to handle the customers
@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  imports: [
    TypeOrmModule.forFeature([Customer, Claim, CustomerPartnerPeriod, Partner]),
  ],
  providers: [CustomerService, CustomerPartnerPeriodService],
})
export class CustomerModule {}
