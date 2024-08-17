import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReserveEventDto } from './dto/reserveDto.dto';
import { ReqUser, ReqUserType } from 'src/auth/util/user.decorator';

@Controller('rsvp')
@ApiTags('Reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('reserve')
  @ApiBearerAuth()
  async reserveEvent(
    @Body() reserveEventDto: ReserveEventDto,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.reservationService.reserveEvent(user.id, reserveEventDto);
  }

  @Put('cancel/:id')
  async cancelReservation(
    @Param('id') eventId: string,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.reservationService.cancelReservation(user.id, eventId);
  }

  @Put('restore/:id')
  async restoreReservation(
    @Param('id') eventId: string,
    @ReqUser() user: ReqUserType,
  ) {
    return await this.reservationService.restoreReservation(user.id, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('allReservation')
  @ApiBearerAuth()
  async getReservation(@ReqUser() user: ReqUserType) {
    return await this.reservationService.getAllReservation(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllUserReservations')
  @ApiBearerAuth()
  async getAllUserReservations(@ReqUser() user: ReqUserType) {
    return this.reservationService.getAllReservationByUser(user.id);
  }
}
