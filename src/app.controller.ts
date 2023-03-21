import {Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';


//req, res know
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  //DI를 해주면 내가 Import해서 쓰는게 아니라 남이 nest에서 넣어 것 그래서 의존성등록부분만 변경하면 얼마든지 재사용성이 늘어남

/*  @Get('user')//Get /abc
  getHello(): string {
    return this.appService.getUser();
  }

  @Post('user')//POST /abc
  postHello(): string{
    return this.appService.postUser();
  }*/
  @Get()
  getHello(){
    return this.appService.getHello();
  }

}
