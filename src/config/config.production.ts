import * as qiniu from 'qiniu';
import { defineConfig } from './defineConfig';

const parseZone = (zone: string) => {
  switch (zone) {
    case 'Zone_as0':
      return qiniu.zone.Zone_as0;
    case 'Zone_na0':
      return qiniu.zone.Zone_na0;
    case 'Zone_z0':
      return qiniu.zone.Zone_z0;
    case 'Zone_z1':
      return qiniu.zone.Zone_z1;
    case 'Zone_z2':
      return qiniu.zone.Zone_z2;
  }
};

export default defineConfig({
  jwt: {
    secret: process.env.JWT_SECRET || '123456',
  },
  // typeorm config
  database: {
    type: 'mysql',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '123456',
    database: process.env.MYSQL_DATABASE || 'sf-admin',
    synchronize: false,
    maxSize: process.env.MYSQL_LOG_MAXSIZE,
    maxFiles: process.env.MYSQL_LOG_MAXFILES,
    logging: ['error'],
  },
  // redis cache config
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1', // default value
    port: parseInt(process.env.REDIS_PORT) || 6379, // default value
    password: process.env.REDIS_PASSWORD || '123456',
    db: 0,
  },
  // qiniu config
  qiniu: {
    accessKey: process.env.QINIU_ACCESSKEY,
    secretKey: process.env.QINIU_SECRETKEY,
    domain: process.env.QINIU_DOMAIN,
    bucket: process.env.QINIU_BUCKET,
    zone: parseZone(process.env.QINIU_ZONE || 'Zone_z2'),
    access: (process.env.QINIU_ACCESS_TYPE as any) || 'public',
  },
  // logger config
  logger: {
    timestamp: false,
    dir: process.env.LOGGER_DIR,
    maxSize: process.env.LOGGER_MAX_SIZE,
    maxFiles: process.env.LOGGER_MAX_FILES,
    errorLogName: process.env.LOGGER_ERROR_FILENAME,
    appLogName: process.env.LOGGER_APP_FILENAME,
  },
});
