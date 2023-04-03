import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import {Channels} from "../entities/Channels";
import {ChannelChats} from "../entities/ChannelChats";
import { Users } from 'src/entities/Users';
import {Workspaces} from "../entities/Workspaces";
import {ChannelMembers} from "../entities/ChannelMembers";
import {EventsModule} from "../events/events.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels,
      ChannelChats,
      Users,
      Workspaces,
      ChannelMembers,
    ]),
    EventsModule, //eventsModule을 넣어야됨 gateway 넣으면 안됨 넣을때마다 new가 되므로
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService]
})
export class ChannelsModule {}
