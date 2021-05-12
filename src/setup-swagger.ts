import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version, name, homepage, license } from '../package.json';
import { ADMIN_PREFIX } from './modules/admin/admin.constants';

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(name)
    .setDescription('Api文档')
    .setVersion(version)
    .setLicense(license, homepage)
    .setTermsOfService(homepage)
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
