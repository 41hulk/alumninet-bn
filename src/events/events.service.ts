import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';

import { EventDto } from '../events/dto/event.dto';
import { ProfileDto } from '../auth/dto/profile.dto';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/createEventDto.dto';
import { ReserveEventDto } from './dto/reserveDto.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents() {
    const events = await this.prisma.event.findMany({
      where: { delete_at: null },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return events.map((event) => {
      return new EventDto({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        user: new ProfileDto({
          id: event.user.id,
          email: event.user.email,
          username: event.user.username,
        }),
      });
    });
  }

  async getOneEvent(userId: string, eventId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }

    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    const events = await this.prisma.event.findUnique({
      where: { id: eventId, delete_at: null },
      include: { user: true, reservations: true },
    });

    return new EventDto({
      id: events.id,
      title: events.title,
      description: events.description,
      date: events.date,
      location: events.location,
      user: new ProfileDto({
        id: events.user.id,
        email: events.user.email,
        username: events.user.username,
      }),
    });
  }

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

  async createEvent(userId: string, data: CreateEventDto) {
    const { title, description, date, location } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    if (!user.isAdmin) {
      throw new PreconditionFailedException('The user is not an admin');
    }
    const newEvent = await this.prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
        reservations: true,
      },
    });
    if (!newEvent) {
      throw new NotFoundException('Could not create a new event');
    }

    return new EventDto({
      id: newEvent.id,
      title: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      date: newEvent.date,
      user: new ProfileDto({
        id: newEvent.user.id,
        email: newEvent.user.email,
        username: newEvent.user.username,
      }),
    });
  }

  async deleteEvent(userId: string, eventId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isAdmin) {
      throw new PreconditionFailedException('The user is not an admin');
    }
    return await this.prisma.event.update({
      where: { id: eventId },
      data: { delete_at: new Date() },
    });
  }

  async restoreEvent(userId: string, eventId: string) {
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.isAdmin) {
      throw new PreconditionFailedException('The user is not an admin');
    }
    return await this.prisma.event.update({
      where: { id: eventId },
      data: { delete_at: null },
    });
  }

  async permanentlyDeleteEvent(userId: string, eventId: string) {
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.isAdmin) {
      throw new PreconditionFailedException('The user is not an admin');
    }
    return await this.prisma.event.delete({
      where: { id: eventId },
    });
  }
}

//TODO: Create a way to update and delete events
//TODO: Create a way to cancel reservations
//TODO: create a way to soft delete everything
