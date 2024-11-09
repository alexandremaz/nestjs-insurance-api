import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

// DTO to return a claim
export class ClaimResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The claim ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Water Damage',
    description: 'The title of the claim',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'Water leak in the bathroom',
    description: 'Detailed description of the claim',
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: 100,
    description: 'Point value of the claim',
  })
  @Expose()
  pointValue: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the customer this claim belongs to',
  })
  @Expose()
  customerId: number;

  constructor(partial: Partial<ClaimResponseDto>) {
    Object.assign(this, partial);
  }
}
