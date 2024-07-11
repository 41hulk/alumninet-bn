import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCampaignDto } from './dto/CreateCampaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async getCampaigns() {
    const campaigns = await this.prisma.campaign.findMany({
      where: { deleted_at: null },
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
    return campaigns;
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
  }
}
