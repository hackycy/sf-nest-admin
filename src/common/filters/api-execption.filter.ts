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
    response.header('Content-Type', 'application/json; charset=utf-8');
    // prod env will not return internal error message
    response.status(status).send({
      code:
        exception instanceof ApiException
          ? (exception as ApiException).getErrorCode()
          : status,
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? isDev()
            ? `${exception}`
            : '服务器异常，请稍后再试'
          : (exception as HttpException).getResponse(),
    });
  }
}
