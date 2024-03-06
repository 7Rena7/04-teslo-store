import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as validateUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error, createProductDto);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    try {
      const [products, count] = await Promise.all([
        this.productsRepository.find({ take: limit, skip: offset }),
        this.productsRepository.count(),
      ]);
      return { count, products };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    try {
      let product: Product;

      if (validateUUID(term)) {
        product = await this.productsRepository.findOneBy({ id: term });
      } else {
        let query = this.productsRepository.createQueryBuilder();
        product = await query
          .where('LOWER(title) =:title or slug =:slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase(),
          })
          .getOne();
      }

      if (!product)
        throw new NotFoundException(
          `No product found with the provided search term \'${term}\'.`,
        );

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(
        `No product found with the provided id ${id}`,
      );
    try {
      await this.productsRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return product;
  }

  async remove(id: string) {
    try {
      const { affected } = await this.productsRepository.delete({ id });
      if (!affected)
        throw new NotFoundException(
          `No product found with the provided id ${id}`,
        );
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  handleDBExceptions(error: any, dto?: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status === 400) throw new BadRequestException(error.message);
    if (error.status === 404) throw new NotFoundException(error.message);
    if (error.status) console.log(error.status);
    this.logger.error(error, [error.detail, dto]);
    throw new InternalServerErrorException('Unexpected error occurred.');
  }
}
