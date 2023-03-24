import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) {
        super();
    }


    serializeUser(user: Users, done: CallableFunction) {
        console.log(user);
        done(null, user.id);//validate 되는 순간 여가로 와서 user의 id만 뽑아 Session에다가 저장
    }

    //라우터 요청 시 request.user 가 필요할때마다 id 뽑아 user 객체로 복원하여 req.user에다가 복원
    async deserializeUser(userId: string, done: CallableFunction) {
        return await this.usersRepository
            .findOneOrFail({
                where: { id: +userId },
                select: ['id', 'email', 'nickname'],
                relations: ['Workspaces'], //join 하는방법 Entitys에 있는 relation을 보고 결정
            })
            .then((user) => {
                console.log('user', user);
                done(null, user);//req.user로 되서 보내짐
            })
            .catch((error) => done(error));//비동기 에러대비
    }
}
