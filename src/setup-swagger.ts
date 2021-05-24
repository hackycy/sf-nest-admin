import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ADMIN_PREFIX } from './modules/admin/admin.constants';

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('sf-nest-admin')
    .setDescription('Api文档')
    .setLicense('MIT', 'https://github.com/hackycy/sf-nest-admin')
    .setTermsOfService('https://github.com/hackycy/sf-nest-admin')
    .addSecurity(ADMIN_PREFIX, {
      description: '后台管理接口授权',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`/doc/${ADMIN_PREFIX}/swagger-api`, app, document);
}
