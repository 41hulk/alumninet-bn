import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthUserDto } from './dto/AuthUser.dto';

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

    if (events.length === 0) {
      return { message: 'No events found for you, RSVP to an event first' };
    }

    return events;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deleted_at: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new AuthUserDto({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  async updateUsername(userId: string, username: string) {
    if (!/^[a-zA-Z0-9_.-]*$/.test(username)) {
      throw new ConflictException(
        'Username can only contain letters, numbers, underscores, dashes and dots',
      );
    }

    const usernameTaken = await this.prisma.user.findFirst({
      where: { username: username },
    });

    if (usernameTaken) {
      throw new ConflictException('Username already taken');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { username: username },
    });

    return new AuthUserDto({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }
}
