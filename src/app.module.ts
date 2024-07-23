import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import configuration from './config/configuration';
import { WalletModule } from './wallet/wallet.module';
import { IndexerModule } from './indexer/indexer.module';

@Module({
  imports: [ConfigModule(configuration), WalletModule, IndexerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
