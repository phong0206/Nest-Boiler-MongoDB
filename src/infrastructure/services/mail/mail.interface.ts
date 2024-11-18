import { SentMessageInfo } from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

export abstract class IMailService {
  /**
   * @param options
   * @return Promise<SentMessageInfo>
   * @example options = {templateHtmlPath: './templates/example.html',...}
   * @example this.mailService.sendMail(options);
   */

  abstract sendMail(options: MailOptions): Promise<SentMessageInfo>;

  /**
   * @param mailConfig
   * @param options
   * @return Promise<SentMessageInfo>
   * @example this.mailService.sendMailCustom(mailConfig, options);
   */
  abstract sendMailCustom(mailConfig: SMTPConnection.Options, options: MailOptions): Promise<SentMessageInfo>;
}
