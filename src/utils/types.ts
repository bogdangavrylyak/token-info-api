import { ApiProperty } from '@nestjs/swagger';

export interface UniswapToken {
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
}

export class WalletRequestBody {
  @ApiProperty()
  address: string;
}
