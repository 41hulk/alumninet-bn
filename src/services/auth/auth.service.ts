import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}
  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.getOneByEmail(email);
    if (user?.password !== pass) {
      return new UnauthorizedException();
    }

    const { password, ...result } = user;

    return result;
  }
}
