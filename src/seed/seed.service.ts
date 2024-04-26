import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed.data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async executeSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertProducts(user);

    return `Seed executed`;
  }

  private async deleteTables() {
    this.productsService.deleteAllProducts();
    const queryBuilder = this.usersRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.usersRepository.create(user));
    });

    const dbUsers = await this.usersRepository.save(users);

    return dbUsers[0];
  }

  private async insertProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);
  }
}
