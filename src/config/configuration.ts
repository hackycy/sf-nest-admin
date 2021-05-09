import DevConfig from './config.development';
import ProdConfig from './config.production';

/**
 * config.{env}.ts must be return object
 */
export const ENV_CONFIG = {
  development: DevConfig,
  production: ProdConfig,
};

export default () => ENV_CONFIG[process.env.NODE_ENV];
