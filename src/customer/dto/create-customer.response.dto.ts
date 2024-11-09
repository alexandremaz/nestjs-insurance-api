import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

// DTO to return the created customer
export class CreateCustomerResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The customer ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The customer email address',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The customer full name',
  })
  @Expose()
  name: string;

  constructor(partial: Partial<CreateCustomerResponseDto>) {
    Object.assign(this, partial);
  }
}
