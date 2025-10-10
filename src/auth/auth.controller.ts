import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  type CreatePartnerDto,
  type CreatePartnerResponse,
  CreatePartnerResponseDto,
  type LoginResponse,
  LoginResponseDto,
} from './auth.dto';
import type { AuthService } from './auth.service';
import { GetPartner } from './decorators/get-partner.decorator';
import type { Partner } from './entities/partner.entity';
import { AdminApiKeyAuthGuard } from './guards/admin-api-key-auth.guard';
import { PartnerApiKeyAuthGuard } from './guards/partner-api-key-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
// Controller to handle the creation of partners and the login of partners + verification of the API key (a bit useless, just for tests purposes)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AdminApiKeyAuthGuard)
  @Post('create-partner')
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiHeader({
    description: 'Admin API key',
    name: 'x-admin-api-key',
  })
  @ApiResponse({
    description: 'Partner created successfully',
    status: 201,
    type: CreatePartnerResponseDto,
  })
  @ApiResponse({
    description: 'Access denied',
    status: 403,
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
    description: 'Partner API key',
    name: 'x-api-key',
  })
  @ApiResponse({
    description: 'Login successful',
    status: 200,
    type: LoginResponseDto,
  })
  @ApiResponse({
    description: 'Access denied',
    status: 403,
  })
  @ZodSerializerDto(LoginResponseDto)
  async login(@GetPartner() partner: Partner): Promise<LoginResponse> {
    return this.authService.loginPartner(partner);
  }
}
