import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
}
