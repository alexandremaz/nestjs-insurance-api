import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// DTO to create a customer
export class CreateCustomerDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the customer',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the customer',
  })
  @IsEmail()
  email: string;
}
