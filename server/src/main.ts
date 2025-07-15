import '@shared/config/crud.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { YemotRouterService } from '@shared/utils/yemot/v2/yemot-router.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = new DocumentBuilder()
    .setTitle('teacher-report-nra')
    .setDescription('Demo website description')
    .setVersion('1.0')
    .addTag('demo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    credentials: true,
    origin: [
      new RegExp('http(s?)://' + process.env.DOMAIN_NAME),
      process.env.IP_ADDRESS && new RegExp('http(s?)://' + process.env.IP_ADDRESS + ':[d]*'),
      'http://localhost:30013',
    ],
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  const yemotRouterSvc = app.get(YemotRouterService);
  app.use('/yemot/handle-call', yemotRouterSvc.getRouter());

  await app.listen(3000);
  console.log(`Application is running on port ${3000}`);
}
bootstrap();
