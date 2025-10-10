import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/customer.entity';
import { ClaimController } from './claim.controller';
import { Claim } from './claim.entity';
import { ClaimService } from './claim.service';

// Module to handle the claims of a customer
@Module({
  controllers: [ClaimController],
  exports: [ClaimService],
  imports: [TypeOrmModule.forFeature([Claim, Customer])],
  providers: [ClaimService],
})
export class ClaimModule {}
