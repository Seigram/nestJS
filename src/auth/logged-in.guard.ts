import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInGuard implements CanActivate { //guard는 CanActivate를 써줘야 됨
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated(); //여기서 True False에 따라 컨트롤러를 쓸 수 있는지 판단 true면 로그인한 사용자들이 쓸수 있음
  }
}
