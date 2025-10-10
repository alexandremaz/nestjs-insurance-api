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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { CustomerPartnerPeriodService } from '../auth/customer-partner-period.service';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { CreateCustomerPartnerPeriodDto } from '../auth/dto/customer-partner-period.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { CustomerService } from './customer.service';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateCustomerResponseDto } from './dto/create-customer.response.dto';
import { CustomerResponseDto } from './dto/get-customer.response.dto';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { UpdateCustomerDto } from './dto/update-customer.dto';

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
    type: CreateCustomerResponseDto,
  })
  @ApiResponse({
    description: 'Invalid data',
    status: 400,
  })
  @ZodSerializerDto(CreateCustomerResponseDto)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer =
      await this.customerService.createCustomer(createCustomerDto);
    return customer;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    description: 'Customer found',
    status: 200,
    type: CustomerResponseDto,
  })
  @ApiResponse({
    description: 'Customer not found',
    status: 404,
  })
  @ZodSerializerDto(CustomerResponseDto)
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
    type: CustomerResponseDto,
  })
  @ApiResponse({
    description: 'Customer not found',
    status: 404,
  })
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
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
    @Body() createContractDto: CreateCustomerPartnerPeriodDto,
    @Request() req,
  ) {
    return await this.periodService.create(
      createContractDto,
      customerId,
      req.user.id,
    );
  }
}
