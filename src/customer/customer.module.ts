import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPartnerPeriodService } from '../auth/customer-partner-period.service';
import { Partner } from '../auth/entities/partner.entity';
import { Claim } from '../claim/claim.entity';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerPartnerPeriod } from './customer-partner-period.entity';

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
