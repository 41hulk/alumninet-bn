import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if validation is successful', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if validation fails', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return data and access_token', async () => {
      const mockUser = { email: 'test@example.com', id: 1 };
      const token = 'testToken';
      jwtService.sign = jest.fn().mockReturnValue(token);

      const result = await service.login(mockUser);
      expect(result).toEqual({ data: mockUser, access_token: token });
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      prismaService.user.create = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.register(
        'test@example.com',
        'password',
        false,
      );
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashedPassword',
          isAdmin: false,
        },
      });
    });
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ email: 'test@example.com' }];
      prismaService.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      const result = await service.getAll();
      expect(result).toEqual(mockUsers);
    });
  });
});
