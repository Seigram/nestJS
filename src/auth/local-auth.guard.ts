import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport"; // 가드를 새로 만듬
//passport local 전략 시리얼라이저 필요 전부 프로바이더로 만들어야됨

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { //local Strategy가 실행된다.
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = await super.canActivate(context);
        if(can){
            const request = context.switchToHttp().getRequest();
            console.log('login for cookie');
            await super.logIn(request);//done 되면 req.login으로 가고 시리얼라이즈로 이동
        }

        return true;
    }
}