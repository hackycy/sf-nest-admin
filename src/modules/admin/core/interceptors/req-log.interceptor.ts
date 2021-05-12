import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SysLogService } from '../../system/log/log.service';
import {
  ADMIN_USER,
  NO_LOG_KEY_METADATA,
} from 'src/modules/admin/admin.constants';
import { ResOp } from 'src/common/class/res.class';

@Injectable()
export class ReqLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private logService: SysLogService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    return next.handle().pipe(
      tap(
        (data) => {
          this.log(startTime, context, data);
        },
        (e) => {
          this.log(startTime, context, e);
        },
      ),
    );
  }

  log(startTime: number, context: ExecutionContext, data: unknown): void {
    // check need log ?
    const noLog = this.reflector.get<boolean>(
      NO_LOG_KEY_METADATA,
      context.getHandler(),
    );
    if (noLog) {
      return;
    }
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    this.logService.saveReqLog(
      request.ip,
      request.url.split('?')[0],
      request.method.toUpperCase() === 'GET' ? request.query : request.body,
      data instanceof HttpException
        ? data.getStatus()
        : data instanceof ResOp
        ? 200
        : 500,
      Date.now() - startTime,
      request.method,
      request[ADMIN_USER] ? request[ADMIN_USER].uid : null,
    );
  }
}
