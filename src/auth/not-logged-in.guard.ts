import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return !request.isAuthenticated();//여기서 True False에 따라 컨트롤러를 쓸 수 있는지 판단 false 로그인 안한 사용자들이 쓸수 없음
  }
}
