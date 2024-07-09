import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Dto } from '../../lib/dto/Dto';

export class ReserveEventDto extends Dto<ReserveEventDto> {
  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  eventId: number;
}
