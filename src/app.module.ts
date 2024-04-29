import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { CommonModule } from './common/common.module';
import { AppEnvConfiguration } from './config/app/app.config';
import { appConfigValidationSchema } from './config/app/schema.validation';
import { FilesModule } from './files/files.module';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppEnvConfiguration],
      validationSchema: appConfigValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      entities: [Product],
      autoLoadEntities: true,
      synchronize: true, // DO NOT USE IN PRODUCTION
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),

    UsersModule,

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    MessagesWsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
