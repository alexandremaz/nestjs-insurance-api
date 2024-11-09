import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseInterceptors,
  SerializeOptions,
  UseGuards,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/get-customer.response.dto';
import { CreateCustomerResponseDto } from './dto/create-customer.response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomerPartnerPeriodService } from '../auth/customer-partner-period.service';
import { CreateCustomerPartnerPeriodDto } from '../auth/dto/customer-partner-period.dto';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
// Controller to handle the customers
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly periodService: CustomerPartnerPeriodService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CreateCustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer =
      await this.customerService.createCustomer(createCustomerDto);
    return new CreateCustomerResponseDto(customer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  async findOne(@Param('id') id: number) {
    const customer = await this.customerService.findOneWithClaims(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return new CustomerResponseDto(customer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
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
    status: 200,
    description: 'Customer deleted successfully',
  })
  async remove(@Param('id') id: number) {
    return await this.customerService.remove(id);
  }

  @Post(':id/contracts')
  @ApiOperation({ summary: 'Create a new contract for a customer' })
  @ApiResponse({
    status: 201,
    description: 'Contract created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or overlapping contract',
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
