### sf-nest-admin

![](https://img.shields.io/github/commit-activity/m/hackycy/sf-nest-admin) ![](https://img.shields.io/github/license/hackycy/sf-nest-admin) ![](https://img.shields.io/github/repo-size/hackycy/sf-nest-admin) ![](https://img.shields.io/github/languages/top/hackycy/sf-nest-admin)

**基于NestJs + TypeScript + TypeORM + Redis + MySql + Vue + Element-UI编写的一款简单高效的前后端分离的权限管理系统。希望这个项目在全栈的路上能够帮助到你。**

前端项目地址：[传送门](https://github.com/hackycy/sf-vue-admin)

### 演示地址

- [http://opensource.admin.si-yee.com](http://opensource.admin.si-yee.com/)
- [Swagger Api文档](http://opensource.admin.si-yee.com/api/doc/admin/swagger-api/static/index.html)

演示环境账号密码：

|     账号     |  密码  |           权限           |
| :----------: | :----: | :----------------------: |
|  openadmin   | 123456 | 仅只有各个功能的查询权限 |
| monitoradmin | 123456 |  系统监控页面及按钮权限  |

本地部署账号密码：

|   账号    |  密码  |    权限    |
| :-------: | :----: | :--------: |
| rootadmin | 123456 | 超级管理员 |

### 模块列表

#### 系统

```bash
├─系统管理
│  ├─用户管理
│  ├─角色管理
│  ├─菜单管理
├─系统监控
│  ├─在线用户
│  ├─登录日志
│  ├─请求追踪
├─任务调度
│  ├─定时任务
│  └─任务日志
```

#### 网盘空间

```bash
├─空间管理
├─空间概览
```

### 系统特点

- 前后端请求参数校验
- JWT 认证
- 基于 NestJs 框架，内置了基础的中间件支持（用户认证、访问日志、请求追踪等）
- 用户权限动态刷新
- 代码简单，结构清晰

### 技术选型

#### 后端

- NestJs + TypeScript
- TypeORM（MYSQL）
- ioredis（Redis）
- bull（队列）

#### 前端

- Vue、Vue-Router、VueX
- Element-UI

### 使用Docker快速体验项目

``` sh
git clone https://github.com/hackycy/sf-nest-admin.git
cd sf-nest-admin/docs/sample/
docker-compose -f "docker-compose.yml" up -d --build
```

> 等待执行完成后，浏览器打开`http://localhost:7002/`即可体验

### 本地开发

#### 初始化数据库，以及服务启动

新建数据库并导入数据库脚本，文件位于 `sql/init.sql`，确保`MySql版本>=5.7`

修改数据库配置信息，在`src/config/config.${env}.ts`目录下更改对应模式下的配置

内置`swagger`文档，启动运行项目后访问：`http://127.0.0.1:7001/swagger-ui/index.html`即可

**参考对应配置请参考：[config.development.ts](https://github.com/hackycy/sf-nest-admin/tree/main/docs/sample)**

#### 运行项目

``` bash
$ git clone https://github.com/hackycy/sf-nest-admin.git
$ cd sf-nest-admin
$ npm i
$ npm run dev
```

### 系统截图

![](https://raw.githubusercontent.com/hackycy/sf-nest-admin/master/docs/screenshot/1.png)

![](https://raw.githubusercontent.com/hackycy/sf-nest-admin/master/docs/screenshot/2.png)

![](https://raw.githubusercontent.com/hackycy/sf-nest-admin/master/docs/screenshot/3.png)

![](https://raw.githubusercontent.com/hackycy/sf-nest-admin/master/docs/screenshot/4.png)

![](https://raw.githubusercontent.com/hackycy/sf-nest-admin/master/docs/screenshot/5.png)

### 项目部署

#### 执行

```
$ npm run build
$ npm run start
```

#### 反向代理配置示例

```conf
server
{
    # ... 省略

	# 请添加以下配置
    location / {
      try_files $uri $uri/ /index.html;
    }

    location /api/
    {
        proxy_pass http://127.0.0.1:7001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;

        #缓存相关配置
        #proxy_cache cache_one;
        #proxy_cache_key $host$request_uri$is_args$args;
        #proxy_cache_valid 200 304 301 302 1h;

        #持久化连接相关配置
        proxy_connect_timeout 3000s;
        proxy_read_timeout 86400s;
        proxy_send_timeout 3000s;
        #proxy_http_version 1.1;
        #proxy_set_header Upgrade $http_upgrade;
        #proxy_set_header Connection "upgrade";

        add_header X-Cache $upstream_cache_status;

        #expires 12h;
    }

    # ... 省略
}
```

### 环境要求

- Node.js 12.x+
- Typescript 2.8+
- MYSQL 5.7+
- Redis 5.0+

### 欢迎Star && PR

**如果项目有帮助到你可以点个Star支持下。有更好的实现欢迎PR。**

### 致谢

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
