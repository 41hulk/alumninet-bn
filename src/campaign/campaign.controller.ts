import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCampaignDto } from './dto/CreateCampaign.dto';
import { ReqUser, ReqUserType } from '../auth/util/user.decorator';
import { CampaignDto } from './dto/campaign.dto';

@Controller('campaign')
@ApiTags('Campaigns')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @UseGuards(JwtAuthGuard)
  @Get('allCampaigns')
  @ApiBearerAuth()
  async getCampaigns(): Promise<CampaignDto[]> {
    return this.campaignService.getCampaigns();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  async getCampaignById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':query')
  @ApiBearerAuth()
  async searchCampaigns(@Param('query') query: string) {
    return this.campaignService.searchCampaigns(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('createCampaign')
  @ApiBearerAuth()
  async createCampaign(
    @ReqUser() user: ReqUserType,
    @Body() data: CreateCampaignDto,
  ) {
    return this.campaignService.createCampaign(user.id, data);
  }
}
