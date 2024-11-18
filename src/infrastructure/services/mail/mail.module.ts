import { EnvironmentConfigModule, EnvironmentConfigService } from '@config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Global } from '@nestjs/common';
import { SESClient } from '@aws-sdk/client-ses';
import { IMailService } from './mail.interface';
import { MailService } from './mail.service';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const getMailerConfig = (configService: EnvironmentConfigService) => {
  const regionSES = configService.getSESRegion();

  const defaults = { from: `"No Reply" <${configService.getMailFrom()}>` };

  if (regionSES) {
    return {
      transport: { SES: { ses: new SESClient({ region: regionSES }) } },
      defaults,
      template: {
        dir: process.cwd() + '/src/infrastructure/services/mail/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }

  return {
    transport: {
      host: configService.getHostMailer(),
      port: configService.getPortMailer(),
      secure: configService.getPortMailer() === 465, // Direct comparison is clearer
      auth: {
        user: configService.getUserMailer(),
        pass: configService.getPasswordMailer(),
      },
      template: {
        dir: process.cwd() + '/src/infrastructure/services/mail/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    },
    defaults,
  };
};

@Global()
@Module({
  providers: [
    {
      provide: IMailService,
      useClass: MailService, // Use your custom mail service instead of NodemailerService
    },
  ],
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService) => {
        return getMailerConfig(configService);
      },
    }),
    ExceptionsModule,
    LoggerModule,
  ],
  exports: [IMailService],
})
export class MailModule {}
