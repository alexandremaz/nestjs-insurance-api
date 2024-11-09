import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Claim } from '../../claim/claim.entity';

// DTO to return a customer from GET /customers/:id endpoint
export class CustomerResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique customer identifier',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Customer email address',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 150,
    description: 'Total points from all claims',
  })
  @Expose()
  @Transform(({ obj }) => {
    return obj.claims.reduce(
      (sum: number, claim: Claim) => sum + claim.pointValue,
      0,
    );
  })
  totalPoints: number;

  constructor(partial: Partial<CustomerResponseDto>) {
    Object.assign(this, partial);
  }
}
