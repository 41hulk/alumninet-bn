import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { EventsModule } from './events/events.module';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { UsersModule } from './users/users.module';
import { CampaignModule } from './campaign/campaign.module';
import { DonationModule } from './donation/donation.module';

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

    EventsModule,

    UsersModule,

    CampaignModule,

    DonationModule,
  ],
  controllers: [AppController, EventsController],
  providers: [AppService, JwtStrategy, PrismaService, EventsService],
})
export class AppModule {}
