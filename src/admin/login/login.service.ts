import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AdminLoginService {
  private redis: Redis;

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redis.get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redis.get(`admin:token:${id}`);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.redis.get(`admin:perms:${id}`);
  }
}
