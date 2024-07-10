import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { EventDto } from './event.dto';
import { Dto } from '../../lib/dto/Dto';

export class ReservationDto extends Dto<ReservationDto> {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  event: EventDto;

  @ApiProperty()
  @IsNotEmpty()
  user: ProfileDto;

  @ApiProperty()
  @IsNotEmpty()
  createdAt: Date;
}
