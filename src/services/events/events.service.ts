import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { CreateEventDto } from 'src/dto/Eventdto/createEventDto.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents() {
    return await this.prisma.event.findMany();
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
    return await this.prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        user: { connect: { id: userId } },
      },
      include: { user: true, reservations: true },
    });
  }
}
