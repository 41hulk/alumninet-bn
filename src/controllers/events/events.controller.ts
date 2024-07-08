import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqUser, ReqUserType } from 'src/auth/util/user.decorator';
import { CreateEventDto } from 'src/dto/Eventdto/createEventDto.dto';
import { EventDto } from 'src/dto/Eventdto/event.dto';

import { EventsService } from 'src/services/events/events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBearerAuth()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @ReqUser() user: ReqUserType,
  ): Promise<EventDto> {
    console.log(user);
    return this.eventsService.createEvent(user.id, createEventDto);
  }

  @Get('all')
  @ApiBearerAuth()
  async getEvents(): Promise<EventDto[]> {
    return this.eventsService.getEvents();
  }
}

//TODO: Test role guard
