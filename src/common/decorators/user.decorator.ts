import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const User =createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }, //javascript랑은 다름
);
//User라는 Decorator를 만든 것