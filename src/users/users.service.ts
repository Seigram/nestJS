import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../entities/Users";
import {Repository} from "typeorm";
import {bcrypt} from 'bcrypt';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,) {     //DI
    }
    async join(email: string, nickname: string, password: string){
        if(!email){
            throw new Error('이메일 없음')
            return;
        }
        if(!nickname){
            throw new Error('닉네임 없음')
            //이미존재하는 이메일
            return;
        }
        if(!password){
            throw new Error('암호 없음')
            //이미존재하는 이메일
            return;
        }
        //->DTO 단에서 처리가능
        const user = await this.usersRepository.findOne( { where: { email } });
        if (user) {
            //이미 존재하는 유저 에러
            throw new Error('USER_EXISTS')
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.usersRepository.save({
           email,
           nickname,
           password: hashedPassword,
        });
    }

    getUser() {

    }
}
