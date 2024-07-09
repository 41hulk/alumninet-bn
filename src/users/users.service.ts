import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AllReservationUserDTO } from './dto/allReservation';
import { EventDto } from 'src/events/dto/event.dto';
import { ProfileDto } from 'src/auth/dto/profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { deleted_at: null },
      include: { Reservation: true },
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  async getAllReservationByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deleted_at: null },
      include: { Reservation: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reservation = user.Reservation;

    const events = await this.prisma.event.findMany({
      where: {
        id: { in: reservation.map((reservation) => reservation.eventId) },
      },
    });

    return { data: events };
  }
}
