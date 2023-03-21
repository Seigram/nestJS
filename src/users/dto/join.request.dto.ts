import {ApiProperty} from "@nestjs/swagger";

export class JoinRequestDto {
    //interface는 런타임때 날라감
    //class는 type역할하고 계속 남아서 타입검증 및 validation
    //convention .찍는거 export default export class로 쓰는것

    @ApiProperty({
        example: 'seigram0884@gmail.com',
        description: '이메일',
        required: true,
    })
    public email: string;
    @ApiProperty({
        example: '바보',
        description: '별명',
        required: true,
    })
    public nickname: string;
    @ApiProperty({
        example: '1234qwer!',
        description: '비밀번호',
        required: true,
    })
    public password: string;
}