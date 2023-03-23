import {BadRequestException, HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "../entities/Users";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,) {     //DI
    }
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
        const user = await this.usersRepository.findOne( { where: { email } });
        if (user) {
            //이미 존재하는 유저 에러
            //throw new Error('USER_EXISTS')
            throw new UnauthorizedException('이미 유저가 존재하네?');//더 세부적인 에러
            //throw new HttpException('이미 유저가 존재하네?', 401);
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
