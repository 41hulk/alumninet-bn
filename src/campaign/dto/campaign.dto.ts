import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { Dto } from 'src/lib/dto/Dto';
import { AuthUserDto } from 'src/users/dto/AuthUser.dto';

export class CampaignDto extends Dto<CampaignDto> {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  targetAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  user: ProfileDto;
}
