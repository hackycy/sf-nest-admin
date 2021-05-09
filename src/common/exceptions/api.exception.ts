import { HttpException } from '@nestjs/common';
import ErrorContants from '../contants/error.contant';

/**
 * Api业务异常均抛出该异常
 */
export class ApiException extends HttpException {
  /**
   * 业务类型错误代码，非Http返回类型
   */
  private errorCode: number;

  constructor(errorCode: number) {
    super(ErrorContants[errorCode], 200);
    this.errorCode = errorCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
