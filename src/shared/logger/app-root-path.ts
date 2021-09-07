import path from 'path';
import fs from 'fs';

/**
 * 获取应用根目录
 * @returns 应用根目录
 */
export function getAppRootPath(): string {
  // Check for environmental variable
  if (process.env.APP_ROOT_PATH) {
    return path.resolve(process.env.APP_ROOT_PATH);
  }
  // 逐级查找 node_modules 目录
  let cur = __dirname;
  const root = path.parse(cur).root;

  let appRootPath = '';
  while (true) {
    if (
      fs.existsSync(path.join(cur, 'node_modules')) &&
      fs.existsSync(path.join(cur, 'package.json'))
    ) {
      // 如果存在node_modules、package.json
      appRootPath = cur;
    }
    // 已经为根路径，无需向上查找
    if (root === cur) {
      break;
    }

    // 继续向上查找
    cur = path.resolve(cur, '..');
  }

  if (appRootPath) {
    process.env.APP_ROOT_PATH = appRootPath;
  }
  return appRootPath;
}
