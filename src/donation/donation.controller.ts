import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DonationService } from './donation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
}
