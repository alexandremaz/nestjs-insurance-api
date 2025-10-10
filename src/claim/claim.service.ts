import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { Claim } from './claim.entity';
import type { BatchCreateClaimDto } from './dto/batch-create-claims.dto';
import type { CreateClaimDto } from './dto/create-claim.dto';

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
