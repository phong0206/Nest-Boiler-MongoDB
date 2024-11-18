import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => {
        const logger = new Logger('MongoDB');
        const uri = `${config.getDatabaseEngine()}://${config.getDatabaseHost()}:${config.getDatabasePort()}/${config.getDatabaseName()}`;
        return {
          uri,
          retryAttempts: 5,
          retryDelay: 1000,
          connectionFactory: (connection) => {
            connection.on('error', (error) => {
              logger.error(`MongoDB connection error: ${error}`);
            });
            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
