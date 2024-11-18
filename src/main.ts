import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { useSwagger } from './app.swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const env = process.env.NODE_ENV;
  const port = process.env.PORT;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'debug', 'verbose', 'warn'],
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  // pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // base routing
  app.setGlobalPrefix('api/v1');

  // swagger config
  if (env !== 'production') {
    await useSwagger(app);
  }

  await app.listen(port).then(async () => {
    const url = await app.getUrl();
    logger.debug(`Your app is running on port ${port}`);
    logger.debug(`Environment: ${env}`);
    logger.debug(`Documentation ${url}/api`);
  });
}

bootstrap();
