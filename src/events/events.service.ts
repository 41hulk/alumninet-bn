import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';

import { EventDto } from '../events/dto/event.dto';
import { ProfileDto } from '../auth/dto/profile.dto';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/createEventDto.dto';

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
