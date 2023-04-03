import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Channels} from "../entities/Channels";
import {MoreThan, Repository} from "typeorm";
import {ChannelMembers} from "../entities/ChannelMembers";
import {Workspaces} from "../entities/Workspaces";
import {ChannelChats} from "../entities/ChannelChats";
import {Users} from "../entities/Users";
import {EventsGateway} from "../events/events.gateway";

@Injectable()
export class ChannelsService {
    //채널관리
    constructor(
        @InjectRepository(Channels)
        private channelsRepository: Repository<Channels>,
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
        @InjectRepository(Workspaces)
        private workspacesRepository: Repository<Workspaces>,
        @InjectRepository(ChannelChats)
        private channelChatsRepository: Repository<ChannelChats>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private readonly eventsGateway: EventsGateway,
    ) {}


    async findById(id: number) {
        return this.channelsRepository.findOne({ where: { id } });
    }

    async getWorkspaceChannels(url: string, myId: number) {
        return this.channelsRepository
            .createQueryBuilder('channels') //단수 복수로 해서 배열값인지 구분
            .innerJoinAndSelect(
                'channels.ChannelMembers',
                'channelMembers',
                'channelMembers.userId = :myId',
                { myId }, //내가 들어있는 채널만 가져옴
            )
            .innerJoinAndSelect(
                'channels.Workspace',
                'workspace',
                'workspace.url = :url',
                { url },
            )
            .getMany();
    }

    async getWorkspaceChannel(url: string, name: string) {
        return this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
    }

    async createWorkspaceChannels(url: string, name: string, myId: number) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const channel = new Channels();
        channel.name = name;
        channel.WorkspaceId = workspace.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }

    async getWorkspaceChannelMembers(url: string, name: string) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
                name,//채널의 속해있는 사람들
            })
            .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .getMany();
    }

    async createWorkspaceChannelMembers(url, name, email) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
        if (!channel) {
            //return null; // TODO: 이 때 어떻게 에러 발생?
            throw new NotFoundException('채널이 존재하지 않습니다.'); //Exception Filter로 던지자
        }
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
                url,
            })
            .getOne();
        if (!user) {
            //return null;
            throw new NotFoundException('유저가 존재하지 않습니다.'); //Exception Filter로 던지자
        }
        const channelMember = new ChannelMembers();
        channelMember.ChannelId = channel.id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }

    async getWorkspaceChannelChats(
        url: string,
        name: string,
        perPage: number,
        page: number,
    ) {
        return this.channelChatsRepository //채팅한 내역 불러오기
            .createQueryBuilder('channelChats')
            .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
                name, //인덱스 걸어주는게 좋다.
            })
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url, //인덱스 걸어주는게 좋다.
            })
            .innerJoinAndSelect('channelChats.User', 'user')
            .orderBy('channelChats.createdAt', 'DESC') //날짜 역순으로 적렬
            .take(perPage)//limit
            .skip(perPage * (page - 1))
            .getMany();
    }

    async createWorkspaceChannelChats(
        url: string,
        name: string,
        content: string,
        myId: number,
    ) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
        const chats = new ChannelChats();
        chats.content = content;
        chats.UserId = myId;
        chats.ChannelId = channel.id;
        const savedChat = await this.channelChatsRepository.save(chats);
        const chatWithUser = await this.channelChatsRepository.findOne({
            where: { id: savedChat.id },
            relations: ['User', 'Channel'],
        });
        this.eventsGateway.server
            // .of(`/ws-${url}`)
            .to(`/ws-${url}-${chatWithUser.ChannelId}`)
            .emit('message', chatWithUser);
    }

    async createWorkspaceChannelImages(
        url: string,
        name: string,
        files: Express.Multer.File[],
        myId: number,
    ) {
        console.log(files);
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
        if(!channel){
            throw new NotFoundException('채널이 없다')
        }

        for (let i = 0; i < files.length; i++) { //파일여러개면 한번에 올림
            const chats = new ChannelChats();
            chats.content = files[i].path;
            chats.UserId = myId;
            chats.ChannelId = channel.id;
            const savedChat = await this.channelChatsRepository.save(chats);
            const chatWithUser = await this.channelChatsRepository.findOne({
                where: { id: savedChat.id },
                relations: ['User', 'Channel'],
            });
            this.eventsGateway.server //지금 채널에 메세지 보냄
                // .of(`/ws-${url}`)
                .to(`/ws-${url}-${chatWithUser.ChannelId}`)
                .emit('message', chatWithUser);
        }
    }

    async getChannelUnreadsCount(url, name, after) {//채널에서 아직 읽지않는 갯수
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();//channel.id 찾아옴
        return this.channelChatsRepository.count({ //Count(*)
            where: {
                ChannelId: channel.id,
                createdAt: MoreThan(new Date(after)), //createdAt 해줌
            },
        });
    }

    async postChat({url, name, content, myId}){
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
                url,
            })
            .where('channel.name = :name', { name })
            .getOne();
        if(!channel){
            throw new NotFoundException('채널이 존재하지 않습니다.');
        }
        const chats = new ChannelChats();
        chats.content = content;
        chats.UserId = myId;
        chats.ChannelId = channel.id;
        const savedChat = await this.channelChatsRepository.save(chats);
        const chatWithUser = await this.channelChatsRepository.findOne({
           where: { id: savedChat.id },
           relations: ['User', 'Channel'],
        });
        // socket.io로 워크스페이스 + 채널 사용자에게 전달할거임
        this.eventsGateway.server.to(`/ws-${url}-${channel.id}`).emit('message', chatWithUser);
        //서버에 저장하고 모두한테 전송
    }


}
