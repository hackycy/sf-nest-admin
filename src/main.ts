import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ApiExecptionFilter } from './common/filters/api-execption.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg = errors
          .filter((item) => !!item.constraints)
          .map((item) => Object.values(item.constraints).join(','))
          .join(';');
        return new BadRequestException(errMsg);
      },
    }),
  );
  app.useGlobalFilters(new ApiExecptionFilter());
  await app.listen(3000);
}

bootstrap();
