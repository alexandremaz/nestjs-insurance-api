import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import type { CreateCustomer } from './dto/create-customer.dto';
import type { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomer): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findOneWithClaims(id: number) {
    return this.customerRepository.findOne({
      relations: ['claims'],
      where: { id },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return this.customerRepository.save({ ...customer, ...updateCustomerDto });
  }

  async remove(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return this.customerRepository.delete(id);
  }
}
