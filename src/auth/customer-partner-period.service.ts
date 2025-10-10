import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { CustomerPartnerPeriod } from '../customer/customer-partner-period.entity';
import type { CreateCustomerPartnerPeriodDto } from './dto/customer-partner-period.dto';
import { Partner } from './entities/partner.entity';

@Injectable()
export class CustomerPartnerPeriodService {
  constructor(
    @InjectRepository(CustomerPartnerPeriod)
    private periodRepository: Repository<CustomerPartnerPeriod>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async create(
    createDto: CreateCustomerPartnerPeriodDto,
    customerId: number,
    partnerId: number,
  ): Promise<CustomerPartnerPeriod> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    const period = this.periodRepository.create({
      ...createDto,
      customer,
      partner,
    });

    return await this.periodRepository.save(period);
  }
}
