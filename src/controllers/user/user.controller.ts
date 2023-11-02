import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/userDto.dto';
import { UserService } from 'src/services/user/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(
      body.first_name,
      body.last_name,
      body.email,
      body.password,
      body.telephone,
      body.role,
    );
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
