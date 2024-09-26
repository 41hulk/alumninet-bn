import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DonationService } from './donation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqUser, ReqUserType } from 'src/auth/util/user.decorator';
import { CreateDonationDto } from './dto/createDonation.dto';

@Controller('donation')
@ApiTags('donation')
export class DonationController {
  constructor(private donationService: DonationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAll() {
    return await this.donationService.getDonations();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllDonation() {
    return await this.donationService.getDonations();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getDonation(@Param('id') id: string) {
    return await this.donationService.getDonationByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pay')
  @ApiBearerAuth()
  async donateToCampaign(
    @ReqUser() user: ReqUserType,
    @Body() data: CreateDonationDto,
  ) {
    return this.donationService.createDonation(user.id, data);
  }
}
