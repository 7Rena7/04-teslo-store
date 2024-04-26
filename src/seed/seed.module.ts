import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, UsersModule],
})
export class SeedModule {}
