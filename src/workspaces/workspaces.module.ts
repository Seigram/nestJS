import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../entities/Users";
import {ChannelMembers} from "../entities/ChannelMembers";
import {WorkspaceMembers} from "../entities/WorkspaceMembers";
import {Workspaces} from "../entities/Workspaces";
import {Channels} from "../entities/Channels";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Channels, Workspaces, ChannelMembers, WorkspaceMembers]),
  ],
  controllers: [WorkspacesController],
  exports: [WorkspacesService],
  providers: [WorkspacesService]
})
export class WorkspacesModule {}
