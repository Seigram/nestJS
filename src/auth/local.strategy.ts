import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password' });
    }

    async validate(email: string, password: string, done: CallableFunction) {
        const user = await this.authService.validateUser(email, password); //validation 부분을 서비스로 만듬
        if (!user) {
            throw new UnauthorizedException(); //비통과 Exception FIlter로 감
        }
        return done(null, user); //통과
    }
}
