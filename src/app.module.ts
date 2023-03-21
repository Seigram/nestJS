import {MiddlewareConsumer, Module, NestMiddleware, NestModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {LoggerMiddleware} from "./middleware/logger.middleware";
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import {UsersService} from "./users/users.service";

const getEnv = async () =>{
  //const response = axios.get('/비밀키요청') 이런식으로 외부에서 .env를 불러와서 할 수 있음
  return{
    DB_PASSWORD: 'nodejsbook',
    NAME: 'psy'
  }
}
@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, load: [getEnv]}), UsersModule, ChannelsModule, DmsModule, WorkspacesModule], //module 을 개발하고 임포트 시킴
  controllers: [AppController],
  providers: [AppService, ConfigService, UsersService], //.env도 nest가 관리하게끔 //provider에 연결된 것들을 보고 의존성 주입을 해줌
  exports: [],//다른 모듈에서 쓰고 싶을 때
/*  providers:[{
    provide: AppService,
    useClass: AppService //이게 원형임 이걸알아야 커스텀 프로바이더를 만들 수 있음 provide 는 고유한 키
  }]*/
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
