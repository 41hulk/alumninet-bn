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
import { ReqUser, ReqUserType } from 'src/auth/util/user.decorator';
import { CreateEventDto } from 'src/dto/Eventdto/createEventDto.dto';

import { EventsService } from 'src/services/events/events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBearerAuth()
  async createEvent(
    @Body() CreateEventDto: CreateEventDto,
    @ReqUser() user: ReqUserType,
  ): Promise<CreateEventDto> {
    console.log(user);
    return this.eventsService.createEvent(user.id, CreateEventDto);
  }

  @Get('all')
  @ApiBearerAuth()
  async getEvents() {
    return this.eventsService.getEvents();
  }
}
