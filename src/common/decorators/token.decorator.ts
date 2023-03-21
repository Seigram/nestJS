import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const Token =createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{//javascript랑은 다름 ExecutionContext
        const request = ctx.switchToHttp().getResponse();//Http를 쓰므로 switchTo 가있는 이유는 한서버안에 ws rpc http 동시에 돌릴 수 있음
        return request.locals.jwt;
    },
);
//User라는 Decorator를 만든 것
//@Token() token //수정할일 이 생기더라도 중복을 제거할 수 있음