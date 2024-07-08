import { Dto } from 'src/lib/dto/Dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from '@nestjs/class-validator';

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
}
