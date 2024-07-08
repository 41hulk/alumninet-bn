import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEventDto } from 'src/dto/Eventdto/createEventDto.dto';

import { EventsService } from 'src/services/events/events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBearerAuth()
  async createEvent(@Body() body: CreateEventDto, @Request() req) {
    return this.eventsService.createEvent(req.user.userId, body);
  }

  @Get('all')
  @ApiBearerAuth()
  async getEvents() {
    return this.eventsService.getEvents();
  }
}
