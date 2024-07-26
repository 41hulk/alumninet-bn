import {
  Header,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDonationDto } from './dto/createDonation.dto';
import Flutterwave from 'flutterwave-node-v3';
import axios from 'axios';

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

    try {
      await axios
        .post(
          'https://api.flutterwave.com/v3/charges?type=mobile_money_rwanda',
          {
            phone_number: user.cellphone,
            amount: amount,
            currency: 'RWF',
            email: user.email,
            tx_ref: 'MC-dnt' + Math.floor(Math.random() * 1000000),
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            },
          },
        )
        .then((response) => {
          console.log(response.data);
          //FIXME: Make sure that the donation is created after the webhook is successful
          //TODO: implement webhook and update campaign target amount
          //
          if (response.data.status === 'success') {
            console.log('I am here');
            this.prisma.donation
              .create({
                data: {
                  amount,
                  user: { connect: { id: userId } },
                  campaign: { connect: { id: campaignId } },
                },
              })
              .then((response) => {
                console.log('Donation Created', response);
              });
          } else {
            throw new PreconditionFailedException('Transaction failed');
          }
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getTransactionVerification(transactionId: string) {
    const flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY,
    );

    return await flw.Transaction.verify({ id: transactionId }).then(
      (response) => {
        if (
          response.status === 'successful' &&
          response.data.amount === 'successful' &&
          response.data.currency === 'RWF'
        ) {
          return response;
        } else {
          throw new PreconditionFailedException('Transaction failed');
        }
      },
    );
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
