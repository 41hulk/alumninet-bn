import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ReqUser, ReqUserType } from '../auth/util/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUserDto } from './dto/AuthUser.dto';

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

  @Get('getUserById')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserById(@ReqUser() user: ReqUserType) {
    return this.userService.getUserById(user.id);
  }

  @Put('updateUsername/:username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUser(
    @ReqUser() user: ReqUserType,
    @Param('username') username: string,
  ): Promise<AuthUserDto> {
    return this.userService.updateUsername(user.id, username);
  }
}
