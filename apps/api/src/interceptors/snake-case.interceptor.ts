import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const toSnakeCase = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase();

const keysToSnakeCase = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(keysToSnakeCase);
  }

  if (data !== null && typeof data === 'object' && !(data instanceof Date)) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[toSnakeCase(key)] = keysToSnakeCase(value);
      return acc;
    }, {} as Record<string, unknown>);
  }
  return data;
};

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    console.log('SnakeCaseInterceptor');
    // Convert the request body to snake case before validation
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    console.log('body', body);
    request.body = keysToSnakeCase(body);
    return next.handle();
  }
}
