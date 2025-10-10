import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { ClaimService } from './claim.service';
import { BatchCreateClaimDto } from './dto/batch-create-claims.dto';
import { ClaimResponseDto } from './dto/claim.response.dto';
// biome-ignore lint/style/useImportType: NestJS constructor injection
import { CreateClaimDto } from './dto/create-claim.dto';

@ApiTags('Claims')
@Controller('customers/:customerId/claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// Controller to handle the claims of a customer
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new claim for a customer' })
  @ApiResponse({
    description: 'Claim created successfully',
    status: 201,
    type: ClaimResponseDto,
  })
  @ApiResponse({
    description: 'Invalid data',
    status: 400,
  })
  @ZodSerializerDto(ClaimResponseDto)
  async create(
    @Param('customerId') customerId: number,
    @Body() createClaimsDto: CreateClaimDto,
  ) {
    return await this.claimService.createClaim(createClaimsDto, customerId);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create claims for a customer' })
  @ApiResponse({
    description: 'Claims created successfully',
    status: 201,
    type: BatchCreateClaimDto,
  })
  @ApiResponse({
    description: 'Invalid data',
    status: 400,
  })
  async batchCreate(
    @Param('customerId') customerId: number,
    @Body() createClaimsDto: BatchCreateClaimDto,
  ) {
    return await this.claimService.batchCreateClaims(
      createClaimsDto,
      customerId,
    );
  }
}
