import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;
      return await result;
    }
    return await null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      data: user,
      access_token: await this.jwtService.sign(payload),
    };
  }

  async register(
    email: string,
    pass: string,
    isAdmin: boolean,
    cellphone: string,
  ) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('user already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: isAdmin,
        cellphone: cellphone,
      },
    });
    return await user;
  }

  async getAll() {
    return await this.prisma.user.findMany({
      where: { deleted_at: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
