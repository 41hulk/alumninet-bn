import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  first_name: string;

  @ApiProperty({ required: false })
  last_name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true, description: 'Format: +250xxxxxxxx' })
  telephone: string;

  @ApiProperty({ required: false })
  role: string;

  @ApiProperty({ required: false })
  membership: string;
}

export class UpdateUserMembershipDto {
  @ApiProperty({ required: true })
  membership: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({ required: true })
  membership: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Username' })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
