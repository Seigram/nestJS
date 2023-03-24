import {BadRequestException, HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../entities/Users";
import {DataSource, getConnection, Repository} from "typeorm";
import * as bcrypt from 'bcrypt'
import {WorkspaceMembers} from "../entities/WorkspaceMembers";
import {ChannelMembers} from "../entities/ChannelMembers";
import {User} from "../common/decorators/user.decorator";
import {query} from "express";


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @InjectRepository(WorkspaceMembers)
        private workspaceMembersRepository: Repository<WorkspaceMembers>,
        @InjectRepository(ChannelMembers)
        private channelMembersRepository: Repository<ChannelMembers>,
        private connection: DataSource,
        ) {}
    async join(email: string, nickname: string, password: string){
/*        if(!email){
           // throw new Error('이메일 없음')
            throw new BadRequestException('이메일이 읍네?');
            return;
        }
        if(!nickname){
            //throw new Error('닉네임 없음')
            throw new BadRequestException('닉네임이 읍네?');
            //이미존재하는 이메일
            return;
        }
        if(!password){
            //throw new Error('암호 없음')
            //throw new HttpException('암호가 읍네?', 400);
            throw new BadRequestException('암호가 읍네?');
            //이미존재하는 이메일
            return;
        }*/
        //->DTO 단에서 처리가능 들어오는 데이터를 자동으로 검증할 수 없을까??
        //class validator

        //const queryRunner = getConnection().createQueryRunner(); //쓰지말라는거 같음 이건 바로쓰는거기 떄문에 안됨
        const queryRunner = this.connection.createQueryRunner();
        queryRunner.connect();
        await queryRunner.startTransaction();
       /* const user = await this.usersRepository.findOne( { where: { email } });
        if (user) {
            //이미 존재하는 유저 에러
            //throw new Error('USER_EXISTS')
            throw new UnauthorizedException('이미 유저가 존재하네?');//더 세부적인 에러
            //throw new HttpException('이미 유저가 존재하네?', 401);
            return;
        }*/
        const user = await queryRunner.manager.getRepository(Users).findOne( { where: { email } });
        if (user) {
            //이미 존재하는 유저 에러
            //throw new Error('USER_EXISTS')
            throw new UnauthorizedException('이미 유저가 존재하네?');//더 세부적인 에러
            //throw new HttpException('이미 유저가 존재하네?', 401);
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        try{
            const returned = await queryRunner.manager.getRepository(Users).save({ //queryRunner를 통해 repository를 불러와야 한다.
                email,
                nickname,
                password: hashedPassword,
            });//사용자 넣고 워크스페이스에다가 저장
            const workspaceMember = queryRunner.manager.getRepository(WorkspaceMembers).create();
            workspaceMember.UserId = returned.id;
            workspaceMember.WorkspaceId = 1;
            await queryRunner.manager
                .getRepository(WorkspaceMembers)
                .save(workspaceMember);
            await queryRunner.manager.getRepository(ChannelMembers).save({
               UserId: returned.id,
               ChannelId: 1,
            });
            await queryRunner.commitTransaction();
            return true;
        }catch(err){
            console.error(err);
            console.log('뭐임');
            await queryRunner.rollbackTransaction();
            throw err;
        }finally {
            await queryRunner.release(); //세션수가 정해져 있으므로 꼭 끊어야함
        }
/*        const returned = await this.usersRepository.save({
            email,
            nickname,
            password: hashedPassword,
        });//사용자 넣고 워크스페이스에다가 저장
        await this.workspaceMembersRepository.save({
            UserId: returned.id,
            WorkspaceId: 1,
        });//채널도 추가
        await this.channelMembersRepository.save({
            UserId: returned.id,
            ChannelId: 1,
        });*/

        return true;
    }

    getUser() {

    }
}
