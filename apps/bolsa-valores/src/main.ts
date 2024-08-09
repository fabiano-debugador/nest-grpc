import { NestFactory } from '@nestjs/core';
import { BolsaValoresModule } from './bolsa-valores.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BolsaValoresModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'fullcycle',
        protoPath: [join(__dirname, 'orders', 'proto', 'orders.proto')],
        loader: { keepCase: true },
      },
    },
  );
  await app.listen();
}
bootstrap();
