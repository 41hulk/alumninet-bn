import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from '../dto/userDto/registerDto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dto/userDto/loginDto.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { email, password, isAdmin } = body;
    return this.authService.register(email, password, isAdmin);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('allUsers')
  async getProfile() {
    return await this.authService.getAll();
  }
}
