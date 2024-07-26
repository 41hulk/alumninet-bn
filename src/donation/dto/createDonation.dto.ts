import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Dto } from '../../lib/dto/Dto';

export class CreateDonationDto extends Dto<CreateDonationDto> {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  campaignId: string;
}
