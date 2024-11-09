import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

// DTO to create a claim
export class CreateClaimDto {
  @ApiProperty({
    example: 'Water Damage',
    description: 'The title of the claim',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Water leak in the bathroom',
    description: 'Detailed description of the claim',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 100,
    description: 'Point value of the claim',
    minimum: 0,
  })
  @IsNumber()
  pointValue: number;
}
