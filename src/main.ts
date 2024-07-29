import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
