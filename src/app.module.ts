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
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChannelChats} from "./entities/ChannelChats";
import {ChannelMembers} from "./entities/ChannelMembers";
import {Channels} from "./entities/Channels";
import {DMs} from "./entities/DMs";
import {Mentions} from "./entities/Mentions";
import {Users} from "./entities/Users";
import {WorkspaceMembers} from "./entities/WorkspaceMembers";
import {Workspaces} from "./entities/Workspaces";
import {AuthModule} from "./auth/auth.module";

const getEnv = async () =>{
  //const response = axios.get('/비밀키요청') 이런식으로 외부에서 .env를 불러와서 할 수 있음
  return{
    //DB_PASSWORD: 'nodejsbook',
    //NAME: 'psy',
  }
}
@Module({
  //isGlobal 하면 모든 곳에서 ConfiggModule 사용 가능
  imports: [ConfigModule.forRoot({isGlobal: true, load: [getEnv]}),
    AuthModule, //모든모듈은 app모듈에 연결되어야함
    UsersModule,
    ChannelsModule,
    DmsModule,
    WorkspacesModule,
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234qwer!',
    database: 'sleact',
    entities: [
      ChannelChats,
      ChannelMembers,
      Channels,
      DMs,
      Mentions,
      Users,
      WorkspaceMembers,
      Workspaces,
    ],
    synchronize: false, //개발환경일떄만, nest->DB로 옴길떄 한번만들고 false로 하는게 낫다.
    logging: true, //어떤 쿼리를 날렸나 본다.
    keepConnectionAlive: true, //hot reloading 시 계속 연결
  }), TypeOrmModule.forFeature([Users])], //module 을 개발하고 임포트 시킴
  controllers: [AppController],
  providers: [AppService, ConfigService], //.env도 nest가 관리하게끔 //provider에 연결된 것들을 보고 의존성 주입을 해줌
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
