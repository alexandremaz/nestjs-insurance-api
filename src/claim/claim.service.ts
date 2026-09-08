import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity.js';
import { Claim } from './claim.entity.js';
import { type BatchCreateClaimsDto } from './dto/batch-create-claims.dto.js';
import { type CreateClaimDto } from './dto/create-claim.dto.js';

@Injectable()
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
    batchCreateClaimsDto: BatchCreateClaimsDto,
    customerId: number,
  ): Promise<Claim[]> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const claims = batchCreateClaimsDto.claims.map((dto) =>
      this.claimRepository.create({
        ...dto,
        customer,
      }),
    );
    return await this.claimRepository.save(claims);
  }
}
