import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {HttpExceptionFilter} from "./httpException.filter";
import {ValidationPipe} from "@nestjs/common";
declare const module: any;
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;


  app.useGlobalPipes(new ValidationPipe()); //class validator 적용
  app.useGlobalFilters(new HttpExceptionFilter()); //ExceptionFIlter 적용

  app.enableCors({
    origin: true,
    credentials: true,
  });

  if(process.env.NODE_ENV === 'production'){
    app.enableCors({
      origin: ['http://sleact.nodebird.com'],
      credentials: true,
    });
  } else{
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }
  app.useStaticAssets(path.join(__dirname, '..','uploads'),{ //express fastify 둘중하나만 있을 수도 있음 NestExpressApplication 적용
    prefix: '/uploads',
  });
  const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('')
      .setVersion('1.0')
      .addTag('')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(
      session({
        secret: 'SECRET',
        resave: true,
        saveUninitialized: true,
        cookie: {
          httpOnly: true,
        }
      }),
  )
  app.use(passport.initialize()); //passport 넣어줘야됨
  app.use(passport.session()); //session로그인 하면 이걸로
  await app.listen(port);
  if(module.hot){
    module.hot.accept();
    module.hot.dispose(()=>app.close());
  }
  console.log(`Listening on port ${port}`);
}
bootstrap();
