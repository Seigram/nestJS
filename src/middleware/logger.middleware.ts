import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{//implements를 씀으로써 강제성을 부여
    private logger = new Logger('HTTP');

//Middleware 만들어 넣어줄 수 있음
    use(request: Request, response: Response, next: NextFunction): void{
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';

        response.on('finish', ()=>{
            const { statusCode} = response;
            const contentLength = response.get('content-length');
            //console.log 가 아닌 this.logger, Logger
            Logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        }); //Router보다 더 먼저 실행됨

        next();
    }
}