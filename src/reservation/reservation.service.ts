import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { ReserveEventDto } from './dto/reserveDto.dto';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async getAllReservation(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }

    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    const reservations = await this.prisma.reservation.findMany({
      where: { delete_at: null },
      include: { user: true, event: true },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }

  async reserveEvent(userId: string, data: ReserveEventDto) {
    const { eventId } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const reservation = await this.prisma.reservation.create({
      data: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
        event: true,
      },
    });
    if (!reservation) {
      throw new NotFoundException('Could not reserve the event');
    }

    return reservation;
  }

  async cancelReservation(userId: string, reservationId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }

    return await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { delete_at: new Date() },
    });
  }

  async restoreReservation(userId: string, reservationId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    return await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { delete_at: null },
    });
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

    if (events.length === 0) {
      return { message: 'No events found for you, RSVP to an event first' };
    }

    return events;
  }
}
