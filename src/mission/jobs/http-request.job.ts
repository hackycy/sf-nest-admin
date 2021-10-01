import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Mission } from '../mission.decorator';

/**
 * Api接口请求类型任务
 */
@Injectable()
@Mission()
export class HttpRequestJob {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 发起请求
   * @param config {AxiosRequestConfig}
   */
  async handle(config: unknown): Promise<void> {
    await this.httpService.axiosRef.request(config);
  }
}
