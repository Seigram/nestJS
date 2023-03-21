import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import {JoinRequestDto} from "./dto/join.request.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserDto} from "../common/dto/user.dto";

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
    getUsers(@Req() req){
        return req.user;
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
    @Post('login')
    login(){
        //login한 사용자 줌
    }

    @ApiOperation({summary: '로그아웃'})
    @Post('logout')
    logOut(@Req() req, @Res() res){
        req.logOut();
        res.clearCookie('connect.sid', {httpOnly: true});
        res.send('ok');
    }


}
