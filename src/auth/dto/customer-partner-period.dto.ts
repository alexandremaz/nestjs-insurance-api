import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerPartnerPeriodDto {
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date of the period',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'End date of the period (optional)',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
