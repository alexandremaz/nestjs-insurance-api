import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClaimResponseDto } from './dto/claim.response.dto';
import { BatchCreateClaimDto } from './dto/batch-create-claims.dto';

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
    status: 201,
    description: 'Claim created successfully',
    type: ClaimResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  async create(
    @Param('customerId') customerId: number,
    @Body() createClaimsDto: CreateClaimDto,
  ) {
    return await this.claimService.createClaim(createClaimsDto, customerId);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create claims for a customer' })
  @ApiResponse({
    status: 201,
    description: 'Claims created successfully',
    type: BatchCreateClaimDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
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
