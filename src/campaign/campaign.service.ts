import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCampaignDto } from './dto/CreateCampaign.dto';
import { CampaignDto } from './dto/campaign.dto';
import { ProfileDto } from '../auth/dto/profile.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async getCampaigns() {
    try {
      const campaigns = await this.prisma.campaign.findMany({
        where: { deleted_at: null },
        include: { user: true },
        orderBy: { created_at: 'desc' },
      });
      return campaigns.map((campaign) => {
        return new CampaignDto({
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          image: campaign.image,
          targetAmount: campaign.targetAmount,
          user: new ProfileDto({
            id: campaign.user.id,
            email: campaign.user.email,
            username: campaign.user.username,
          }),
        });
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getCampaignById(campaignId: string) {
    try {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { user: true },
      });
      if (!campaign) {
        throw new PreconditionFailedException('Campaign not found');
      }
      return new CampaignDto({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        image: campaign.image,
        targetAmount: campaign.targetAmount,
        user: new ProfileDto({
          id: campaign.user.id,
          email: campaign.user.email,
          username: campaign.user.username,
        }),
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async createCampaign(userId: string, data: CreateCampaignDto) {
    const { title, description, startDate, endDate, targetAmount } = data;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    if (!user.isAdmin) {
      throw new PreconditionFailedException('User is not an admin');
    }
    try {
      const newCampaign = await this.prisma.campaign.create({
        data: {
          title,
          description,
          startDate,
          endDate,
          targetAmount,
          user: { connect: { id: userId } },
        },
      });
      return newCampaign;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  //TODO: Implement the donation service
  //TODO: Implement the donation payments services
  //TODO: Implement the donation payments
  //TODO: Create response interfaces for the services functions
}
