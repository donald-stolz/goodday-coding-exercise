import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Utility function to convert snake_case to camelCase
const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Recursively convert object keys from snake_case to camelCase
const keysToCamel = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(keysToCamel);
  }
  if (Decimal.isDecimal(data)) {
    return data.toNumber();
  }
  if (data !== null && typeof data === 'object' && !(data instanceof Date)) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = keysToCamel(value);
      return acc;
    }, {} as Record<string, unknown>);
  }
  return data;
};

@Injectable()
export class CamelCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => keysToCamel(data)));
  }
}
