import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, ReqUserType } from '../auth/util/user.decorator';

import { EventDto } from 'src/events/dto/event.dto';

import { CreateEventDto } from './dto/createEventDto.dto';
import { EventsService } from './events.service';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiBearerAuth()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @ReqUser() user: ReqUserType,
  ): Promise<EventDto> {
    return await this.eventsService.createEvent(user.id, createEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':query')
  @ApiBearerAuth()
  async searchEvent(@Param('query') query: string) {
    return await this.eventsService.searchEvents(query);
  }

  @Put('delete/:id')
  async deleteEvent(
    @Param('id') eventId: string,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.eventsService.deleteEvent(user.id, eventId);
  }

  @Put('restoreEvent/:id')
  async restoreEvent(
    @Param('id') eventId: string,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.eventsService.restoreEvent(user.id, eventId);
  }

  @Delete('permDelete/:id')
  async permanentlyDeleteEvent(
    @Param('id') eventId: string,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.eventsService.permanentlyDeleteEvent(user.id, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiBearerAuth()
  async getEvents(): Promise<EventDto[]> {
    return await this.eventsService.getEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiBearerAuth()
  async getOneEvent(
    @Param('id') eventId: string,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.eventsService.getOneEvent(user.id, eventId);
  }
}
