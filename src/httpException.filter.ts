import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp(); //http 뽑아오면
        const response = ctx.getResponse<Response>();//에러 내용
        const status = exception.getStatus();//status 코드
        const err = exception.getResponse() as
            | string
            | { error: string; statusCode: 400; message: string[] }; // class-validator 타이핑

        console.log(status, err);
        response.status(status).json({msg: err});

/*
        if (typeof err !== 'string' && err.statusCode === 400) {
            // class-validator 에러
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }

        response.status(status).json({
            success: false,
            code: status,
            data: err.message,
        });
*/

/*        if (typeof err !== 'string' && err.statusCode === 400) {
            // class-validator 에러
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }

        response.status(status).json({
            success: false,
            code: status,
            data: err.message,
        });*/
    }
}
