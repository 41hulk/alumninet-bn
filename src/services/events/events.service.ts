import { Injectable } from '@nestjs/common';
import { CreateEventDto } from 'src/dto/Eventdto/createEventDto.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents() {
    return await this.prisma.event.findMany();
  }

  async createEvent(userId: string, data: CreateEventDto) {
    return await this.prisma.event.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }
}
