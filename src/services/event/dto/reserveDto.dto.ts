import { IsInt, IsNotEmpty } from 'class-validator';

export class ReserveEventDto {
  @IsInt()
  @IsNotEmpty()
  eventId: number;
}
