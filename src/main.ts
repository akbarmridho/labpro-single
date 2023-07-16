import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { patchNestJsSwagger } from 'nestjs-zod';
import * as process from 'process';
import { ZodValidationExceptionFilter } from './utils/zod-exception.filter';
import { TransformInterceptor } from './utils/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0);

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodValidationExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Labpro Single Service')
    .setDescription('The labpro signle service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('PORT', 3000));
}

void bootstrap();
