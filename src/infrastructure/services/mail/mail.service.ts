import { Injectable } from '@nestjs/common';
import { IMailService } from './mail.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { promises as fs } from 'fs';

@Injectable()
export class MailService extends IMailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly exceptionService: ExceptionsService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async sendMail(options: MailOptions): Promise<SentMessageInfo> {
    try {
      const { templateHtmlPath, html, ...mailOptions } = options;
      let content;
      if (templateHtmlPath) {
        const emailHtml = await this.readTemplate(
          process.cwd() + '/src/infrastructure/services/mail/templates/' + templateHtmlPath,
        );
        content = this.replaceTemplateVariables(emailHtml, options.context);
      }
      return this.mailerService.sendMail({
        ...mailOptions,
        html: content || html,
      });
    } catch (error) {
      this.logger.error(`Failed to send mail: ${options.subject}`, error.stack);
      this.exceptionService.badRequestException({ message: 'Failed to send email.' });
    }
  }

  async sendMailCustom(mailConfig: SMTPConnection.Options, options: MailOptions): Promise<SentMessageInfo> {
    try {
      const transporter = createTransport(mailConfig);
      const { templateHtmlPath, html, ...mailOptions } = options;
      let content;

      if (templateHtmlPath) {
        const emailHtml = await this.readTemplate(templateHtmlPath);
        content = this.replaceTemplateVariables(emailHtml, options.context);
      }
      return transporter.sendMail({
        ...mailOptions,
        html: content || html,
      });
    } catch (error) {
      this.logger.error(`Failed to send mail: ${options?.subject}`, error.stack);
      throw new Error(`Failed to send email via custom SMTP: ${error.message}`);
    }
  }

  private async readTemplate(path: string): Promise<string> {
    try {
      const template = await fs.readFile(path, 'utf8');
      return template;
    } catch (err) {
      console.error(`Error reading template file at ${path}:`, err);
      throw new Error('Could not read template file.');
    }
  }

  private replaceTemplateVariables(template: string, data: Record<string, string>): string {
    return Object.keys(data).reduce((result, key) => {
      return result.replace(new RegExp(`{${key}}`, 'g'), data[key]);
    }, template);
  }
}
