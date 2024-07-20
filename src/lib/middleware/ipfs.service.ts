import { Injectable } from '@nestjs/common';
import { create } from 'ipfs-http-client';

@Injectable()
export class IpfsService {
  private readonly ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });

  // async uploadFile(file: Express.Multer.File): Promise<string> {
  //   const { path } = await this.ipfs.add(file.buffer);
  //   return path;
  // }
}
