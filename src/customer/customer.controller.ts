import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerPartnerPeriodService } from '../auth/customer-partner-period.service.js';
import {
  createCustomerPartnerPeriodSchema,
  type CreateCustomerPartnerPeriodDto,
} from '../auth/dto/customer-partner-period.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CustomerService } from './customer.service.js';
import {
  type CreateCustomerDto,
  createCustomerSchema,
} from './dto/create-customer.dto.js';
import { createCustomerResponseSchema } from './dto/create-customer.response.dto.js';
import { customerResponseSchema } from './dto/get-customer.response.dto.js';
import {
  updateCustomerSchema,
  type UpdateCustomerDto,
} from './dto/update-customer.dto.js';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// Controller to handle the customers
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly periodService: CustomerPartnerPeriodService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    description: 'Customer created successfully',
    status: 201,
    // TODO : fix schema
  })
  @ApiResponse({
    description: 'Invalid data',
    status: 400,
  })
  @SerializeOptions({ schema: createCustomerResponseSchema })
  async create(
    @Body({ schema: createCustomerSchema })
    createCustomerDto: CreateCustomerDto,
  ) {
    const customer =
      await this.customerService.createCustomer(createCustomerDto);
    return customer;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    description: 'Customer found',
    status: 200,
    // TODO : fix schema
  })
  @ApiResponse({
    description: 'Customer not found',
    status: 404,
  })
  @SerializeOptions({ schema: customerResponseSchema })
  async findOne(@Param('id') id: number) {
    const customer = await this.customerService.findOneWithClaims(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({
    description: 'Customer updated successfully',
    status: 200,
    // TODO : fix schema
  })
  @ApiResponse({
    description: 'Customer not found',
    status: 404,
  })
  @SerializeOptions({ schema: customerResponseSchema })
  async update(
    @Param('id') id: number,
    @Body({ schema: updateCustomerSchema })
    updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({
    description: 'Customer deleted successfully',
    status: 200,
  })
  async remove(@Param('id') id: number) {
    return await this.customerService.remove(id);
  }

  @Post(':id/contracts')
  @ApiOperation({ summary: 'Create a new contract for a customer' })
  @ApiResponse({
    description: 'Contract created successfully',
    status: 201,
  })
  @ApiResponse({
    description: 'Invalid data or overlapping contract',
    status: 400,
  })
  async createContract(
    @Param('id') customerId: number,
    @Body({ schema: createCustomerPartnerPeriodSchema })
    createContractDto: CreateCustomerPartnerPeriodDto,
    @Request() req: { user: { id: number } },
  ) {
    return await this.periodService.create(
      createContractDto,
      customerId,
      req.user.id,
    );
  }
}
