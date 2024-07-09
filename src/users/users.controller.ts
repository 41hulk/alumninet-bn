import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ReqUser, ReqUserType } from 'src/auth/util/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getAllUserReservations')
  @ApiBearerAuth()
  async getAllUserReservations(@ReqUser() user: ReqUserType) {
    return this.userService.getAllReservationByUser(user.id);
  }

  @Get('getAllUsers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
