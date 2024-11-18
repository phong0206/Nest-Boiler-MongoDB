import { EMAIL_SENDING_QUEUE, SEND_MAIL_CUSTOM_PROCESS, SEND_MAIL_SES_PROCESS } from '@common';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { IMailService } from 'src/infrastructure/services/mail/mail.interface';

@Processor(EMAIL_SENDING_QUEUE)
export class EmailSendingQueueProcessor {
  private readonly logger = new Logger(EmailSendingQueueProcessor.name);
  constructor(private readonly mailService: IMailService) {}
  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @Process(SEND_MAIL_SES_PROCESS)
  async sendEmailSES(job: Job<{ options: MailOptions }>) {
    const { options } = job.data;
    await this.mailService.sendMail(options);
  }

  @Process(SEND_MAIL_CUSTOM_PROCESS)
  async sendEmailCustom(job: Job<{ mailConfig: SMTPConnection.Options; options: MailOptions }>) {
    const { mailConfig, options } = job.data;
    await this.mailService.sendMailCustom(mailConfig, options);
  }
}
