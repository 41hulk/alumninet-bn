import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Dto } from '../../lib/dto/Dto';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { ReserveEventDto } from 'src/events/dto/reserveDto.dto';
import { ReservationDto } from 'src/events/dto/reservation.dto';

export class AllReservationUserDTO extends Dto<AllReservationUserDTO> {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: [] })
  @IsNotEmpty()
  reservations: ReservationDto[];
}
