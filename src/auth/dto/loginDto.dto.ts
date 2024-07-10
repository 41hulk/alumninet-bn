import { Dto } from '../../lib/dto/Dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';

export class LoginDto extends Dto<LoginDto> {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
