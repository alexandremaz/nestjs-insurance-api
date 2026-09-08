import {
  Body,
  Controller,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ClaimService } from './claim.service.js';
import {
  batchCreateClaimsSchema,
  type BatchCreateClaimsDto,
} from './dto/batch-create-claims.dto.js';
import { claimResponseSchema } from './dto/claim.response.dto.js';
import {
  type CreateClaimDto,
  createClaimSchema,
} from './dto/create-claim.dto.js';

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
    // TODO : fix schema
  })
  @ApiResponse({
    description: 'Invalid data',
    status: 400,
  })
  @SerializeOptions({ schema: claimResponseSchema })
  async create(
    @Param('customerId') customerId: number,
    @Body({ schema: createClaimSchema }) createClaimsDto: CreateClaimDto,
  ) {
    return await this.claimService.createClaim(createClaimsDto, customerId);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create claims for a customer' })
  @ApiResponse({
    description: 'Claims created successfully',
    status: 201,
    // TODO : fix schema
  })
  @ApiResponse({
    description: 'Invalid data',
    status: 400,
  })
  // TODO : see how to serialize response, not like that : @SerializeOptions({ schema: batchCreateClaimsSchema })
  async batchCreate(
    @Param('customerId') customerId: number,
    @Body({ schema: batchCreateClaimsSchema })
    createClaimsDto: BatchCreateClaimsDto,
  ) {
    return await this.claimService.batchCreateClaims(
      createClaimsDto,
      customerId,
    );
  }
}
