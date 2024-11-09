import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO to update a customer
export class UpdateCustomerDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the customer',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the customer',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
