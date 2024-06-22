import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/registerDto.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

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

      const body: RegisterDto = {
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

      const body: RegisterDto = {
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

  // describe('register', () => {
  //   it('should create and return a new user', async () => {
  //     const mockUser = {
  //       id: 1,
  //       email: 'test@example.com',
  //       password: 'hashedPassword',
  //     };
  //     jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

  //     const body: RegisterDto = {
  //       email: 'test@example.com',
  //       password: 'password',
  //     };
  //     const result = await controller.register(body);

  //     expect(result).toEqual(mockUser);
  //     expect(authService.register).toHaveBeenCalledWith(
  //       'test@example.com',
  //       'password',
  //     );
  //   });
  // });

  // describe('getProfile', () => {
  //   it('should return an array of users', async () => {
  //     const mockUsers = [{ email: 'test@example.com' }];
  //     jest.spyOn(authService, 'getAll').mockResolvedValue(mockUsers);

  //     const result = await controller.getProfile();

  //     expect(result).toEqual(mockUsers);
  //     expect(authService.getAll).toHaveBeenCalled();
  //   });
  // });
});
