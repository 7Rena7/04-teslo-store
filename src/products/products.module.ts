import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
