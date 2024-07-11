import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Dto } from 'src/lib/dto/Dto';

export class CreateCampaignDto extends Dto<CreateCampaignDto> {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  startDate: Date;

  @ApiProperty()
  @IsString()
  endDate: string;

  @ApiProperty()
  @IsString()
  targetAmount: number;
}
