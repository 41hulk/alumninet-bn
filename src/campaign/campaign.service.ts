import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCampaignDto } from './dto/CreateCampaign.dto';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { AuthUserDto } from 'src/users/dto/AuthUser.dto';

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
      return campaigns;
    } catch (e) {
      return {
        message: e.message,
      };
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
      return campaign;
    } catch (e) {
      return {
        message: e.message,
      };
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
      return {
        message: e.message,
      };
    }
  }
}

//TODO: Implement the donation service
//TODO: Implement the donation payments services
//TODO: Implement the donation payments
//TODO: Create response interfaces for the services functions
