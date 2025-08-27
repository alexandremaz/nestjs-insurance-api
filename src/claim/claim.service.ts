import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './claim.entity';
import { CreateClaimDto } from './dto/create-claim.dto';
import { Customer } from '../customer/customer.entity';
import { BatchCreateClaimDto } from './dto/batch-create-claims.dto';

@Injectable()
// Service to handle the claims of a customer
export class ClaimService {
  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createClaim(
    createClaimDto: CreateClaimDto,
    customerId: number,
  ): Promise<Claim> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const claim = this.claimRepository.create({
      ...createClaimDto,
      customer,
    });
    return await this.claimRepository.save(claim);
  }

  async batchCreateClaims(
    batchCreateClaimDto: BatchCreateClaimDto,
    customerId: number,
  ): Promise<Claim[]> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const claims = batchCreateClaimDto.claims.map((dto) =>
      this.claimRepository.create({
        ...dto,
        customer,
      }),
    );
    return await this.claimRepository.save(claims);
  }
}
