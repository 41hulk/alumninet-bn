import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from 'src/auth/dto/loginDto.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const mockUser = { email: 'test@example.com', id: 1 };
      const loginResult = { data: mockUser, access_token: 'testToken' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const body: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = await controller.login(body);

      expect(result).toEqual(loginResult);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const body: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      await expect(controller.login(body)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });
  });
});
