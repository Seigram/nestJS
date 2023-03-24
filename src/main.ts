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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;


  app.useGlobalPipes(new ValidationPipe()); //class validator 적용
  app.useGlobalFilters(new HttpExceptionFilter()); //ExceptionFIlter 적용
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
