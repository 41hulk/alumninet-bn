import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from '@nestjs/class-validator';

import { Dto } from '../../lib/dto/Dto';
export class RegisterDto extends Dto<RegisterDto> {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty()
  @IsBoolean()
  cellphone: string;
}
