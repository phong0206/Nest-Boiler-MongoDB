import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailSendingQueueProcessor } from './emailSending/emailSending.processor';
import { EmailSendingQueueService } from './emailSending/emailSending.service';
import { EnvironmentConfigModule, EnvironmentConfigService } from '@config';
import { MailModule } from 'src/infrastructure/services/mail/mail.module';
import { EMAIL_SENDING_QUEUE } from '@common';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (configService: EnvironmentConfigService) => ({
        redis: {
          host: configService.getRedisHost(),
          port: configService.getRedisPort(),
          password: configService.getRedisPassword(),
        },
      }),
    }),
    BullModule.registerQueue({ name: EMAIL_SENDING_QUEUE }),
    MailModule,
  ],
  providers: [EmailSendingQueueService],
  exports: [EmailSendingQueueService],
})
export class QueueModule {}
