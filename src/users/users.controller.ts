import {Body, Controller, Get, Post, Req, Res, UseInterceptors} from '@nestjs/common';
import {JoinRequestDto} from "./dto/join.request.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "../common/dto/user.dto";
import {User} from "../common/decorators/user.decorator";
import {UndefinedToNullInterceptor} from "../common/interceptors/undefinedToNull.interceptor";


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
        return user; //type 추론되게 바꾸자
        //res.locals.jwt //미들웨어간 공유할수 있게 했었음
    }

    @ApiOperation({summary: '회원가입'})
    @Post()
        postUsers(@Body() body: JoinRequestDto){
            this.userService.postUsers(body.email, body.nickname, body.password);
    }


    @ApiResponse({
        status: 200,
        description: '성공',
    })
    @ApiOperation({ summary: '로그인'})
    @Post('login')
    login(@User() user){
        return user;
        //login한 사용자 줌
    }
    //res.json(user); 이런식으로 보내줌 이걸 { data : user ] 이런식으로 바꿔줌
    //error가 난 경우  exception filter 끝단 중복제거 전후 중복제거
    // { data: user, code: 'SUCCESS' } 이렇게 해줫엇음 매번 넣어주기힘드니까 인터셉터 활용

    @ApiOperation({summary: '로그아웃'})
    @Post('logout')
    logOut(@Req() req, @Res() res){ //req, res는 쓰는게 안좋다.
        req.logOut();
        res.clearCookie('connect.sid', {httpOnly: true});
        res.send('ok');// ok를 하면 조작할 수가 없음
    }


}
