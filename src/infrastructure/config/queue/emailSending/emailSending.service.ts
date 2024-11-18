import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import Mail from 'nodemailer/lib/mailer';
import { EMAIL_SENDING_QUEUE, SEND_MAIL_CUSTOM_PROCESS, SEND_MAIL_SES_PROCESS } from '@common';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

@Injectable()
export class EmailSendingQueueService {
  constructor(
    @InjectQueue(EMAIL_SENDING_QUEUE)
    private readonly emailSendingQueue: Queue,
  ) {}

  async sendEmailSES(options: Mail.Options) {
    await this.emailSendingQueue.add(SEND_MAIL_SES_PROCESS, {
      options,
    });
  }

  async sendEmailCustom(mailConfig: SMTPConnection.Options, options: MailOptions) {
    await this.emailSendingQueue.add(SEND_MAIL_CUSTOM_PROCESS, { mailConfig, options });
  }
}
