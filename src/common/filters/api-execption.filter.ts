import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { isDev } from 'src/config/configuration';
import { ApiException } from '../exceptions/api.exception';
import { ResOp } from '../class/res.class';

/**
 * 异常接管，统一异常返回数据
 */
@Catch()
export class ApiExecptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // check api exection
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // set json response
    response.header('Content-Type', 'application/json; charset=utf-8');
    // prod env will not return internal error message
    const code =
      exception instanceof ApiException
        ? (exception as ApiException).getErrorCode()
        : status;
    let message = '服务器异常，请稍后再试';
    // 开发模式下提示500类型错误，生产模式下屏蔽500内部错误提示
    if (isDev() || status < 500) {
      message =
        exception instanceof HttpException ? exception.message : `${exception}`;
    }
    const result = new ResOp(code, null, message);
    response.status(status).send(result);
  }
}
