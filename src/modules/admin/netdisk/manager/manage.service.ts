import { Inject, Injectable } from '@nestjs/common';
import {
  NETDISK_DELIMITER,
  NETDISK_EVENT_DELETE,
  NETDISK_EVENT_RENAME,
  NETDISK_LIMIT,
  QINIU_CONFIG,
} from '../../admin.constants';
import { IQiniuConfig } from '../../admin.interface';
import * as qiniu from 'qiniu';
import { rs, conf, auth } from 'qiniu';
import { UtilService } from 'src/shared/services/util.service';
import { isEmpty } from 'lodash';
import {
  SFileInfo,
  SFileInfoDetail,
  SFileList,
  TaskExecStatusInfo,
} from './manage.class';
import { REDIS_INSTANCE } from 'src/common/contants/common.contants';
import { Redis } from 'ioredis';
import { OnEvent } from '@nestjs/event-emitter';
import { SysUserService } from '../../system/user/user.service';
import { AccountInfo } from '../../system/user/user.class';

@Injectable()
export class NetDiskManageService {
  private config: conf.ConfigOptions;
  private mac: auth.digest.Mac;
  private bucketManager: rs.BucketManager;

  constructor(
    @Inject(QINIU_CONFIG) private qiniuConfig: IQiniuConfig,
    @Inject(REDIS_INSTANCE) private redis: Redis,
    private userService: SysUserService,
    private util: UtilService,
  ) {
    this.mac = new qiniu.auth.digest.Mac(
      this.qiniuConfig.accessKey,
      this.qiniuConfig.secretKey,
    );
    this.config = new qiniu.conf.Config({
      zone: this.qiniuConfig.zone,
    });
    // bucket manager
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  /**
   * 获取文件列表
   * @param prefix 当前文件夹路径
   * @param marker 下一页标识
   * @returns iFileListResult
   */
  async getFileList(prefix = '', marker = '', skey = ''): Promise<SFileList> {
    return new Promise<SFileList>((resolve, reject) => {
      this.bucketManager.listPrefix(
        this.qiniuConfig.bucket,
        {
          prefix,
          limit: NETDISK_LIMIT,
          delimiter: NETDISK_DELIMITER,
          marker,
        },
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            // 如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
            // 指定options里面的marker为这个值
            const fileList: SFileInfo[] = [];
            if (!isEmpty(respBody.commonPrefixes)) {
              // dir
              for (const dirPath of respBody.commonPrefixes) {
                const name = (dirPath as string)
                  .substr(0, dirPath.length - 1)
                  .replace(prefix, '');
                if (isEmpty(skey) || name.includes(skey)) {
                  fileList.push({
                    name: (dirPath as string)
                      .substr(0, dirPath.length - 1)
                      .replace(prefix, ''),
                    type: 'dir',
                    id: this.util.generateRandomValue(12),
                  });
                }
              }
            }
            if (!isEmpty(respBody.items)) {
              // file
              for (const item of respBody.items) {
                const fileKey = item.key.replace(prefix, '') as string;
                // 模拟目录
                if (
                  !isEmpty(fileKey) &&
                  (isEmpty(skey) || fileKey.includes(skey))
                ) {
                  fileList.push({
                    id: item.hash,
                    name: fileKey,
                    type: 'file',
                    fsize: item.fsize,
                    mimeType: item.mimeType,
                    putTime: new Date(parseInt(item.putTime) / 10000),
                  });
                }
              }
            }
            resolve({
              list: fileList,
              marker: respBody.marker || null,
            });
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(name: string, path: string): Promise<SFileInfoDetail> {
    return new Promise((resolve, reject) => {
      this.bucketManager.stat(
        this.qiniuConfig.bucket,
        `${path}${name}`,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode == 200) {
            const detailInfo: SFileInfoDetail = {
              fsize: respBody.fsize,
              hash: respBody.hash,
              md5: respBody.md5,
              mimeType: respBody.mimeType.split('/x-qn-meta')[0],
              putTime: new Date(parseInt(respBody.putTime) / 10000),
              type: respBody.type,
              uploader: '',
              mark: respBody?.['x-qn-meta']?.['!mark'] ?? '',
            };
            if (!respBody.endUser) {
              resolve(detailInfo);
            } else {
              this.userService
                .getAccountInfo(parseInt(respBody.endUser))
                .then((user: AccountInfo) => {
                  if (isEmpty(user)) {
                    resolve(detailInfo);
                  } else {
                    detailInfo.uploader = user.name;
                    resolve(detailInfo);
                  }
                });
            }
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 修改文件MimeType
   */
  async changeHeaders(name: string, path: string, mark: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bucketManager.changeHeaders(
        this.qiniuConfig.bucket,
        `${path}${name}`,
        {
          mark,
        },
        (err, _, respInfo) => {
          if (err) {
            reject();
            return;
          }
          if (respInfo.statusCode == 200) {
            resolve();
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 创建文件夹
   * @returns true创建成功
   */
  async createDir(dirName: string): Promise<void> {
    const safeDirName = dirName.endsWith('/') ? dirName : `${dirName}/`;
    return new Promise((resolve, reject) => {
      // 上传一个空文件以用于显示文件夹效果
      const formUploader = new qiniu.form_up.FormUploader(this.config);
      const putExtra = new qiniu.form_up.PutExtra();
      formUploader.put(
        this.createUploadToken(''),
        safeDirName,
        ' ',
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 检查文件是否存在，同可检查目录
   */
  async checkFileExist(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // fix path end must a /

      // 检测文件夹是否存在
      this.bucketManager.stat(
        this.qiniuConfig.bucket,
        filePath,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }
          if (respInfo.statusCode === 200) {
            // 文件夹存在
            resolve(true);
          } else if (respInfo.statusCode === 612) {
            // 文件夹不存在
            resolve(false);
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 创建Upload Token, 默认过期时间一小时
   * @returns upload token
   */
  createUploadToken(endUser: string): string {
    const policy = new qiniu.rs.PutPolicy({
      scope: this.qiniuConfig.bucket,
      insertOnly: 1,
      endUser,
    });
    const uploadToken = policy.uploadToken(this.mac);
    return uploadToken;
  }

  /**
   * 重命名文件
   * @param dir 文件路径
   * @param name 文件名称
   */
  async renameFile(dir: string, name: string, toName: string): Promise<void> {
    const fileName = `${dir}${name}`;
    const toFileName = `${dir}${toName}`;
    const op = {
      force: true,
    };
    return new Promise((resolve, reject) => {
      this.bucketManager.move(
        this.qiniuConfig.bucket,
        fileName,
        this.qiniuConfig.bucket,
        toFileName,
        op,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
          } else {
            if (respInfo.statusCode === 200) {
              resolve();
            } else {
              reject(
                new Error(
                  `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                ),
              );
            }
          }
        },
      );
    });
  }

  /**
   * 设置队列任务状态
   * 0 -> 启动
   * 1 -> 成功 | 不存在redis key
   * 2 -> 失败，在获取状态后会自动移除
   */
  async setQiniuTaskStatus(
    action: string,
    path: string,
    name: string,
    status: number,
    err?: string,
  ): Promise<void> {
    const redisKey = `admin:qiniu:${action}:${path}${name}`;
    if (status === 1) {
      await this.redis.del(redisKey);
    } else {
      await this.redis.set(
        redisKey,
        JSON.stringify({
          status,
          err,
        }),
      );
    }
  }

  /**
   * 获取队列任务状态
   */
  async getQiniuTaskStatus(
    action: string,
    path: string,
    name: string,
  ): Promise<TaskExecStatusInfo> {
    const redisKey = `admin:qiniu:${action}:${path}${name}`;
    const str = await this.redis.get(redisKey);
    if (isEmpty(str)) {
      return {
        status: 1,
      };
    } else {
      const obj: TaskExecStatusInfo = JSON.parse(str);
      if (obj.status === 2) {
        await this.redis.del(redisKey);
      }
      return obj;
    }
  }

  /**
   * 重命名文件夹
   */
  @OnEvent(NETDISK_EVENT_RENAME)
  async renameDir(path: string, name: string, toName: string): Promise<void> {
    try {
      await this.setQiniuTaskStatus('rename', path, name, 0);
      const dirName = `${path}${name}`;
      const toDirName = `${path}${toName}`;
      let hasFile = true;
      let marker = '';
      const op = {
        force: true,
      };
      const bucketName = this.qiniuConfig.bucket;
      while (hasFile) {
        await new Promise<void>((resolve, reject) => {
          // 列举当前目录下的所有文件
          this.bucketManager.listPrefix(
            this.qiniuConfig.bucket,
            {
              prefix: dirName,
              limit: 1000,
              marker,
            },
            (err, respBody, respInfo) => {
              if (err) {
                reject(err);
                return;
              }
              if (respInfo.statusCode === 200) {
                const moveOperations = respBody.items.map((item) => {
                  const { key } = item;
                  const destKey = key.replace(dirName, toDirName);
                  return qiniu.rs.moveOp(
                    bucketName,
                    key,
                    bucketName,
                    destKey,
                    op,
                  );
                });
                this.bucketManager.batch(
                  moveOperations,
                  (err2, respBody2, respInfo2) => {
                    if (err2) {
                      reject(err2);
                      return;
                    }
                    if (respInfo2.statusCode === 200) {
                      if (isEmpty(respBody.marker)) {
                        hasFile = false;
                      } else {
                        marker = respBody.marker;
                      }
                      resolve();
                    } else {
                      reject(
                        new Error(
                          `Qiniu Error Code: ${respInfo2.statusCode}, Info: ${respInfo2.statusMessage}`,
                        ),
                      );
                    }
                  },
                );
              } else {
                reject(
                  new Error(
                    `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                  ),
                );
              }
            },
          );
        });
      }
      await this.setQiniuTaskStatus('rename', path, name, 1);
    } catch (err) {
      await this.setQiniuTaskStatus('rename', path, name, 2, `${err}`);
    }
  }

  /**
   * 获取七牛下载的文件url链接
   * @param key 文件路径
   * @returns 连接
   */
  getDownloadLink(key: string): string {
    if (this.qiniuConfig.access === 'public') {
      return this.bucketManager.publicDownloadUrl(this.qiniuConfig.domain, key);
    } else if (this.qiniuConfig.access === 'private') {
      return this.bucketManager.privateDownloadUrl(
        this.qiniuConfig.domain,
        key,
        Date.now() / 1000 + 36000,
      );
    }
    throw new Error('qiniu config access type not support');
  }

  /**
   * 删除文件
   * @param dir 删除的文件夹目录
   * @param name 文件名
   */
  async deleteFile(dir: string, name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(
        this.qiniuConfig.bucket,
        `${dir}${name}`,
        (err, respBody, respInfo) => {
          if (err) {
            reject(err);
            return;
          }
          if (respInfo.statusCode === 200) {
            resolve();
          } else {
            reject(
              new Error(
                `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
              ),
            );
          }
        },
      );
    });
  }

  /**
   * 删除文件夹
   * @param dir 文件夹所在的上级目录
   * @param name 文件目录名称
   */
  @OnEvent(NETDISK_EVENT_DELETE)
  async deleteDir(path: string, name: string): Promise<void> {
    try {
      await this.setQiniuTaskStatus('delete', path, name, 0);
      const dirName = `${path}${name}/`;
      let hasFile = true;
      let marker = '';
      while (hasFile) {
        await new Promise<void>((resolve, reject) => {
          this.bucketManager.listPrefix(
            this.qiniuConfig.bucket,
            {
              prefix: dirName,
              limit: 1000,
              marker,
            },
            (err, respBody, respInfo) => {
              if (err) {
                reject(err);
                return;
              }
              if (respInfo.statusCode === 200) {
                const deleteOperations = respBody.items.map((item) => {
                  return qiniu.rs.deleteOp(this.qiniuConfig.bucket, item.key);
                });
                this.bucketManager.batch(
                  deleteOperations,
                  (err2, respBody2, respInfo2) => {
                    if (err2) {
                      reject(err2);
                      return;
                    }
                    // 200 is success, 298 is part success
                    if (respInfo2.statusCode === 200) {
                      if (isEmpty(respBody.marker)) {
                        hasFile = false;
                      } else {
                        marker = respBody.marker;
                      }
                      resolve();
                    } else if (respInfo2.statusCode === 298) {
                      reject(new Error('操作异常，但部分文件夹删除成功'));
                    } else {
                      reject(
                        new Error(
                          `Qiniu Error Code: ${respInfo.statusCode}, Info: ${respInfo.statusMessage}`,
                        ),
                      );
                    }
                  },
                );
              }
            },
          );
        });
      }
      await this.setQiniuTaskStatus('delete', path, name, 1);
    } catch (err) {
      await this.setQiniuTaskStatus('delete', path, name, 2, `${err}`);
    }
  }
}
