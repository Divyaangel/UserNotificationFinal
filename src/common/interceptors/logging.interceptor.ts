import { 
    Injectable, 
    NestInterceptor, 
    ExecutionContext, 
    CallHandler, 
    Logger 
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, body } = request;
  
      const now = Date.now();
      return next.handle().pipe(
        tap({
          next: (response) => {
            this.logger.log({
              method,
              url,
              body,
              duration: `${Date.now() - now}ms`,
              status: 'success'
            });
          },
          error: (error) => {
            this.logger.error({
              method,
              url,
              body,
              duration: `${Date.now() - now}ms`,
              status: 'failed',
              error: error.message
            });
          }
        })
      );
    }
  }
  