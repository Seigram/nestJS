// AOP를 적용하게함
// A->D를 적용
// A-> B -> C -> D
// A -> C -> D
// A -> E -> F -> D ->G
// Z -> A -> X -> D
// Controller 실행 전후 특정 동작 넣어줌 예로 실행시간
// Controller 다음에 어떤 동작 할지 정함 응답보냇는데 한번더 조작을 해줄때
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {map, Observable} from "rxjs";

//rx가뭐임? 너무 복잡하다..

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        // 전 부분
        return next.handle().pipe(map((data)=>(data === undefined ? null : data))); //Controller에서 return 해주는 데이터 마지막에 데이터를 가공해주는 역할
        //return next.handle().pipe(catchError); 이거보단 ExceptionFilter를 씀
        //undefined들어가면 에러나므로 null처리
    }
}