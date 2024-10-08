import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PrismaService } from './prisma.service';
import { EventsService } from './events/events.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '15m' },
        }),
        ConfigModule.forRoot(),
        AuthModule,
        EventsModule,
        UsersModule,
        UsersModule,
      ],
      controllers: [AppController],
      providers: [
        AppService,
        JwtStrategy,
        PrismaService,
        EventsService,
        UsersService,
        JwtService,
        AuthService,
      ],
    }).compile();

    appModule = module;
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should have AppService as a provider', () => {
    expect(appModule.get<AppService>(AppService)).toBeDefined();
  });

  // Test for JwtStrategy provider
  it('should have JwtStrategy as a provider', () => {
    expect(appModule.get<JwtStrategy>(JwtStrategy)).toBeDefined();
  });

  // Test for PrismaService provider
  it('should have PrismaService as a provider', () => {
    expect(appModule.get<PrismaService>(PrismaService)).toBeDefined();
  });

  // Test for EventsService provider
  it('should have EventsService as a provider', () => {
    expect(appModule.get<EventsService>(EventsService)).toBeDefined();
  });

  // Additional tests can be added here to verify other providers, controllers, and module imports.
});
