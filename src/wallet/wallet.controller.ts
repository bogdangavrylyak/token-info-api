import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { WalletRequestBody } from '../utils/types';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('')
  public async getWalletTokens(@Body() body: WalletRequestBody) {
    return await this.walletService.getWalletTokens(body.address);
  }
}
