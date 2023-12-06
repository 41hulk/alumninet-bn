import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from 'src/dto/userDto.dto';

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

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.userService.loginUser(body.email, body.password);
    return this.userService.buildUserResponse(user);
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('id/:user_id')
  @ApiOperation({ summary: 'Get user by id' })
  async getOneById(@Param('user_id') user_id: string) {
    return await this.userService.getOnebyId(user_id);
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Get users by role' })
  async getAllByRole(@Param('role') role: string) {
    return await this.userService.getAllbyRole(role);
  }
}
