import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Dto } from '../../lib/dto/Dto';

export class CreateDonationDto extends Dto<CreateDonationDto> {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
