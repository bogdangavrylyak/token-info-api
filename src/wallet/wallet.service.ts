import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from 'ethereum-multicall';
import { ethers } from 'ethers';
import { UniswapToken } from '../utils';
import { ConfigService } from 'src/config/config.module';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  private readonly provider: ethers.providers.Provider;
  private readonly multicall: Multicall;

  constructor(private readonly configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.getOrThrow<string>('providerUrl'),
      1,
    );
    this.multicall = new Multicall({
      ethersProvider: this.provider,
      tryAggregate: true,
    });
  }

  public async getWalletTokens(address: string) {
    const tokenList = await axios.get('https://tokens.uniswap.org/');

    this.logger.log('token list fetched');

    const tokens: UniswapToken[] = tokenList.data.tokens.filter(
      (token: UniswapToken) => token.chainId === 1,
    );

    const contractCallContext: ContractCallContext[] = tokens.map((token) => ({
      reference: token.symbol,
      contractAddress: token.address,
      abi: ['function balanceOf(address owner) view returns (uint256)'],
      calls: [
        {
          reference: token.symbol,
          methodName: 'balanceOf',
          methodParameters: [address],
        },
      ],
    }));

    const results: ContractCallResults =
      await this.multicall.call(contractCallContext);

    this.logger.log('balances called from blockchain');

    const tokenBalances = tokens.map((token) => {
      const balance =
        results.results[token.symbol].callsReturnContext[0].returnValues;
      return {
        symbol: token.symbol,
        balance: ethers.utils.formatUnits(balance, token.decimals),
      };
    });

    return tokenBalances.filter((token) => parseFloat(token.balance) > 0);
  }
}
