import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '../config/config.module';
import { USDC_ABI, USDC_ADDRESS } from '../utils';

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);
  private readonly provider: ethers.providers.Provider;
  private readonly usdcContract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.getOrThrow<string>('providerUrl'),
      1,
    );
    this.usdcContract = new ethers.Contract(
      USDC_ADDRESS,
      USDC_ABI,
      this.provider,
    );
  }

  async onModuleInit() {
    this.logger.log('starting USDC listener');
    await this.listenToTransferEvents();
  }

  private async listenToTransferEvents() {
    this.usdcContract.on('Transfer', (from, to, value) => {
      console.log(
        `Transfer event detected: from ${from} to ${to} value ${ethers.utils.formatUnits(value, 6)}`,
      );
    });
  }
}
