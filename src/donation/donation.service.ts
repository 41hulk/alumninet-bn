import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDonationDto } from './dto/createDonation.dto';

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}

  async getDonations() {
    const donation = await this.prisma.donation.findMany({
      where: { deleted_at: null },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return donation;
  }

  async createDonation(userId: string, data: CreateDonationDto) {
    const { campaignId, amount } = data;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userId) {
      throw new PreconditionFailedException('Missing user id');
    }
    if (!user.isActive) {
      throw new PreconditionFailedException('User is not active');
    }
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    //TODO: implement momo integration here

    const donate = await this.prisma.donation.create({
      data: {
        user: { connect: { id: userId } },
        campaign: { connect: { id: campaignId } },
        amount: amount,
      },
      include: {
        user: true,
        campaign: true,
      },
    });

    if (!donate) {
      throw new NotFoundException('Could not donate to the campaign');
    }
  }
  async getDonationByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Donation: true,
      },
    });
    return user;
  }
}
