import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Workspaces} from "../entities/Workspaces";
import {Repository} from "typeorm";
import {Channels} from "../entities/Channels";
import {WorkspaceMembers} from "../entities/WorkspaceMembers";
import {ChannelMembers} from "../entities/ChannelMembers";
import {Users} from "../entities/Users";

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
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
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
        const workspace = new Workspaces();
        workspace.name = name;
        workspace.url = url;
        workspace.OwnerId = myId;
        const returned = await this.workspaceRepository.save(workspace);
        const workspaceMember = new WorkspaceMembers();
        workspaceMember.UserId = myId;
        workspaceMember.WorkspaceId = returned.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channel = new Channels();
        channel.name = '일반';
        channel.WorkspaceId = returned.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }

    async getWorkspaceMembers(url: string) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.WorkspaceMembers', 'members')
            .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .getMany();
    }

    async createWorkspaceMembers(url, email) {
        const workspace = await this.workspaceRepository.findOne({
            where: { url },
            join: { //realation과 비슷하다.
                alias: 'workspace',
                innerJoinAndSelect: {
                    channels: 'workspace.Channels',
                },
            },
        });
        //쿼리빌더로도 가능
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const workspaceMember = new WorkspaceMembers();
        workspaceMember.WorkspaceId = workspace.id;
        workspaceMember.UserId = user.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers();
        channelMember.ChannelId = workspace.Channels.find(
            (v) => v.name === '일반',
        ).id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }

    //knex.js 쿼리빌더랑 비슷
    async getWorkspaceMember(url: string, id: number) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
                url,
            })
            .getOne(); //쿼리빌더가 표현이 그나마 쉽다.
    }

}
