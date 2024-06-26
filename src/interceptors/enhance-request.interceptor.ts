import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class EnhanceRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (
      request.url.endsWith('/status') ||
      request.url.endsWith('/') ||
      request.url.endsWith('/health')
    ) {
      return next.handle().pipe(tap(() => console.log('After...')));
    }

    const subAccountHeader = request.headers['sub-account'];
    if (!subAccountHeader) {
      throw new BadRequestException('sub-account header is required');
    }

    // Attach the header to the request object for global access
    request.subAccount = subAccountHeader;
    return next.handle().pipe(tap(() => console.log('After...')));
  }
}
