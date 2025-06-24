/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GCPubSubServer } from 'nestjs-google-pubsub-microservice';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // App setup
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const port = process.env.PORT || 3100;

  // Microservice setup
  app.connectMicroservice({
    strategy: new GCPubSubServer({
      topic: 'purchase-orders-topic',
      subscription: 'purchase-orders-subscription',
      client: {
        projectId: 'goodday-exercise',
      },
    }),
  });

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
