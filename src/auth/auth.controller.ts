import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminApiKeyAuthGuard } from './guards/admin-api-key-auth.guard';
import { PartnerApiKeyAuthGuard } from './guards/partner-api-key-auth.guard';
import { GetPartner } from './decorators/get-partner.decorator';
import { Partner } from './entities/partner.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import {
  CreatePartnerDto,
  CreatePartnerResponse,
  CreatePartnerResponseDto,
  LoginResponse,
  LoginResponseDto,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Authentication')
@Controller('auth')
// Controller to handle the creation of partners and the login of partners + verification of the API key (a bit useless, just for tests purposes)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AdminApiKeyAuthGuard)
  @Post('create-partner')
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiHeader({
    name: 'x-admin-api-key',
    description: 'Admin API key',
  })
  @ApiResponse({
    status: 201,
    description: 'Partner created successfully',
    type: CreatePartnerResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @ZodSerializerDto(CreatePartnerResponseDto)
  async createPartner(
    @Body() createPartnerDto: CreatePartnerDto,
  ): Promise<CreatePartnerResponse> {
    const apiKey = await this.authService.generatePartnerApiKey(
      createPartnerDto.partnerName,
    );
    return { apiKey };
  }

  @UseGuards(PartnerApiKeyAuthGuard)
  @Get('login')
  @ApiOperation({ summary: 'Partner login' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'Partner API key',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @ZodSerializerDto(LoginResponseDto)
  async login(@GetPartner() partner: Partner): Promise<LoginResponse> {
    return this.authService.loginPartner(partner);
  }
}
