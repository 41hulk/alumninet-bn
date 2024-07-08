import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { EventsService } from './services/events/events.service';
import { EventsController } from './controllers/events/events.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
  ],
  controllers: [AppController, EventsController],
  providers: [AppService, JwtStrategy, PrismaService, EventsService],
})
export class AppModule {}
