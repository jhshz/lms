import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.NESTJS_PORT ?? process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
bootstrap();
