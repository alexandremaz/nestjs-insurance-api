import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateClaimDto } from './create-claim.dto';

// DTO to create a batch of claims
export class BatchCreateClaimDto {
  @ApiProperty({
    type: [CreateClaimDto],
    description: 'Array of claims to create',
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateClaimDto)
  claims: CreateClaimDto[];
}
