import {Body, Controller, Get, HttpException, Post, Req, Res, UseGuards, UseInterceptors} from '@nestjs/common';
import {JoinRequestDto} from "./dto/join.request.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "../common/dto/user.dto";
import {User} from "../common/decorators/user.decorator";
import {UndefinedToNullInterceptor} from "../common/interceptors/undefinedToNull.interceptor";
import {HttpExceptionFilter} from "../httpException.filter";
import {LocalAuthGuard} from "../auth/local-auth.guard";
import {LoggedInGuard} from "../auth/logged-in.guard";
import {NotLoggedInGuard} from "../auth/not-logged-in.guard";


@UseInterceptors(UndefinedToNullInterceptor)//인터셉터 적용 개별적적용도 가능
@ApiTags('USER')
@Controller('api/users')
export class UsersController {

    constructor(private userService: UsersService) {
    }

    @ApiResponse({
        type: UserDto,
    })

    @ApiResponse({
        status: 200,
        description: '성공',
        type: UserDto,
    })
    @ApiResponse({
        status: 500,
        description: '서버 에러',
        type: UserDto,
    })
    @ApiOperation({summary: '내 정보 조회'})
    @Get()
    getUsers(@User() user){
        return user || false; //type 추론되게 바꾸자 로그인안한 상태면 false
        //res.locals.jwt //미들웨어간 공유할수 있게 했었음
    }

    @UseGuards(new NotLoggedInGuard()) //로그인 안한사람들만 쓸 수 있게
    @ApiOperation({summary: '회원가입'})
    @Post()
    async join(@Body() body: JoinRequestDto){
            await this.userService.join(body.email, body.nickname, body.password);
            //await를 써야 안에 있는 에러가 HttpException Filter로 전송됨

    }


    @ApiResponse({
        status: 200,
        description: '성공',
        type: UserDto
    })
    @ApiOperation({ summary: '로그인'})
    @UseGuards(LocalAuthGuard)//컨트롤러 접근하기전에 권한있는지 체크  로그인 햇는지 여부 403 에러 처리 인터셉터보다 먼저 처리 가드 인터셉터 컨트롤러 서비스 순서임
    @Post('login')
    login(@User() user){
        return user;
        //login한 사용자 줌
    }
    //res.json(user); 이런식으로 보내줌 이걸 { data : user ] 이런식으로 바꿔줌
    //error가 난 경우  exception filter 끝단 중복제거 전후 중복제거
    // { data: user, code: 'SUCCESS' } 이렇게 해줫엇음 매번 넣어주기힘드니까 인터셉터 활용

    @UseGuards(new LoggedInGuard())
    @ApiOperation({summary: '로그아웃'})
    @Post('logout')
    logOut(@Req() req, @Res() res){ //req, res는 쓰는게 안좋다.
        req.logOut();
        res.clearCookie('connect.sid', {httpOnly: true});
        res.send('ok');// ok를 하면 조작할 수가 없음
    }


}
