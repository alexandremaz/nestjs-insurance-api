import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

// DTO to create a partner
export class CreatePartnerDto {
  @ApiProperty({
    example: 'Insurance XYZ',
    description: 'The partner name',
  })
  @IsString()
  @IsNotEmpty()
  partnerName: string;
}

// DTO to return the created partner
export class CreatePartnerResponseDto {
  @ApiProperty({
    example: 'pk_1234567890',
    description: 'The generated API key for the partner',
  })
  @Expose()
  apiKey: string;
}

// DTO to return the login response
export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The JWT access token',
  })
  @Expose()
  access_token: string;
}
