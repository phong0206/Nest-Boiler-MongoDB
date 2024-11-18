import { ISendMailOptions } from '@nestjs-modules/mailer';

declare global {
  interface MailOptions extends ISendMailOptions {
    templateHtmlPath?: string;
  }
}
