import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/customer.entity.js';
import { ClaimController } from './claim.controller.js';
import { Claim } from './claim.entity.js';
import { ClaimService } from './claim.service.js';

// Module to handle the claims of a customer
@Module({
  controllers: [ClaimController],
  exports: [ClaimService],
  imports: [TypeOrmModule.forFeature([Customer, Claim])],
  providers: [ClaimService],
})
export class ClaimModule {}
