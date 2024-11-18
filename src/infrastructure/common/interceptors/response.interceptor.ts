import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { EXCLUDE_RESPONSE_INTERCEPTOR_KEY } from '@common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<IResponse<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    const status = response.statusCode;
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const isExcluded = this.reflector.get<boolean>(EXCLUDE_RESPONSE_INTERCEPTOR_KEY, context.getHandler());

    if (isExcluded) {
      return next.handle().pipe(
        map((data) => {
          return data;
        }),
      );
    }
    return next.handle().pipe(
      map((data) => {
        return {
          status,
          data,
          duration: `${Date.now() - now}ms`,
          method: request.method,
          path: request.path,
        };
      }),
    );
  }
}
