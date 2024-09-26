import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import APIToolkit from 'apitoolkit-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiToolkitClient = APIToolkit.NewClient({
    apiKey: process.env.TRACK_API_KEY,
    debug: false,
    tags: ['environment: production', 'region: us-east-1'],
    serviceVersion: 'v2.0',
  });
  app.use(apiToolkitClient.expressMiddleware);
  //TODO: remove the comments at the end
  // app.setGlobalPrefix('api/v1');

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: 'Content-Type,Authorization',
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Alumni Network API')
    .setDescription('connect - engage - empower')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT);
  console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`);
}
bootstrap();

//TODO: deploy this to digital ocean
//TODO: create analytics dashboard functionalities and generate reports
