import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Workspaces} from "../entities/Workspaces";
import {Repository} from "typeorm";
import {Channels} from "../entities/Channels";
import {WorkspaceMembers} from "../entities/WorkspaceMembers";
import {ChannelMembers} from "../entities/ChannelMembers";

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(Workspaces)
        private workspaceRepository: Repository<Workspaces>,
        @InjectRepository(Channels)
        private channelsRepository: Repository<Channels>,
        @InjectRepository(WorkspaceMembers)
        private workspaceMembersRepository: Repository<WorkspaceMembers>,
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
    ) {}


    async findById(id: number){
        return this.workspaceRepository.findOne({where: { id }});
        //return this.workspaceRepository.findByIds([id]);
    }

    async findMyWorkspaces(myId: number){
        return this.workspaceRepository.find({
            where: { //나는 워크스페이스멤버스에 들어있으니까
                WorkspaceMembers: [{ UserId: myId }], //where문안에서 관계있는 애들의 쿼리를 날려 찾을 수 있게 있게 해줌
            },
        })

    }

    async createWorkspace(name: string, url: string, myId: number){
        const workspace = this.workspaceRepository.create();
        workspace.name = name;
        workspace.url = url;
        workspace.OwnerId = myId;
    }

}
