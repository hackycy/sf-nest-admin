import { EggAppConfig, PowerPartial } from 'egg';
const redisStore = require('cache-manager-ioredis');

export default (): any => {
  const config: PowerPartial<EggAppConfig> = {};

  /**
   * 邮件推送配置
   */
  config.mailer = {
    host: 'xxx host',
    port: 80,
    auth: {
      user: 'xxx@qq.com',
      pass: 'xxxxxxx',
    },
    secure: false,
  };

  // 高德开放平台应用Key
  config.amap = {
    key: 'xxxxxxxxxxxxxxxxxxxxx',
  };

  // bull config
  config.bull = {
    default: {
      redis: {
        port: 6379,
        host: '127.0.0.1',
        password: '123456',
        db: 0,
      },
      prefix: 'admin:task',
    },
  };

  // Root角色对应ID
  config.rootRoleId = 1;

  /**
   * typeorm 配置
   * 文档：https://www.yuque.com/midwayjs/midway_v2/orm#njH6J
   */
  config.orm = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'sf-admin',
    synchronize: false,
    logging: true,
    // timezone: '+00:00',
    /**
     * JavaScript对数据库中int和bigint的区别对待：
     * 刚开始开发中，线下测试数据库id字段采用int，数据库SELECT操作返回的结果是Number，但是使用bigint，数据库返回的为String，
     * 初步猜想是因为bigint的值范围会超过Number，所以采用String。但是这样会对我们业务产生巨大影戏那个，一方面，DTO校验会无法通过，另一方面，问题1中的业务逻辑会受影响。
     * 经过查找各方文档，解决方案是在数据库连接配置中配置：
     * "supportBigNumbers": false
     * 可以配置这个的原因是我们的业务ID距离Number的上线远远达不到，所以可以用这种方式让
     * bigint也返回Number。
     * 但是这样配置，TypeOrm插入操作的返回值中的identifiers字段中的id还是String，所以问题1中的处理方式也要对String进行parseInt操作。
     */
    // supportBigNumbers: false,
  };

  // midway cache
  config.cache = {
    store: redisStore,
    options: {
      host: '127.0.0.1', // default value
      port: 6379, // default value
      password: '123456',
      db: 0,
      ttl: 60,
    },
  };

  return config;
};
