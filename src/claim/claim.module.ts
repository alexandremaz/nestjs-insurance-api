import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './claim.entity';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { Customer } from '../customer/customer.entity';

// Module to handle the claims of a customer
@Module({
  imports: [TypeOrmModule.forFeature([Claim, Customer])],
  providers: [ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
