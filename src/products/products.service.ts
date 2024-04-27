import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { validate as validateUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/users/entities/user.entity';

type FormattedProduct = {
  images: string[];
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
  isActive: boolean;
};

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRespository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly commonService: CommonService,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productsRepository.create({
        ...createProductDto,
        images: images.map((image) =>
          this.productImageRespository.create({ url: image }),
        ),
        user,
      });
      await this.productsRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.commonService.handleDBExceptions(
        error,
        this.logger,
        createProductDto,
      );
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    try {
      const [products, count] = await Promise.all([
        this.productsRepository.find({
          take: limit,
          skip: offset,
          relations: { images: true },
        }),
        this.productsRepository.count(),
      ]);

      const formattedProducts = this.formatProductsImages(products);

      return { count, products: formattedProducts };
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger);
    }
  }

  async findOne(term: string) {
    try {
      let product: Product;

      if (validateUUID(term)) {
        product = await this.productsRepository.findOneBy({ id: term });
      } else {
        let query = this.productsRepository.createQueryBuilder('product');
        product = await query
          .where('LOWER(title) =:title or slug =:slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase(),
          })
          .leftJoinAndSelect('product.images', 'productImages')
          .getOne();
      }

      if (!product)
        throw new NotFoundException(
          `No product found with the provided search term \'${term}\'.`,
        );

      return { ...product, images: product.images.map((img) => img.url) };
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger);
    }
  }

  async update(id: string, { images, ...rest }: UpdateProductDto, user: User) {
    const product = await this.productsRepository.preload({
      id,
      ...rest,
    });

    if (!product)
      throw new NotFoundException(
        `No product found with the provided id ${id}`,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((img) =>
          this.productImageRespository.create({ url: img }),
        );
      }

      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        ...product,
        images: product.images?.map((img) => img.url) ?? [],
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonService.handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string) {
    try {
      const { affected } = await this.productsRepository.delete({ id });
      if (!affected)
        throw new NotFoundException(
          `No product found with the provided id ${id}`,
        );
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger);
    }
  }

  private formatProductsImages(products: Product[]): FormattedProduct[] {
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((img) => img.url),
    }));
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.commonService.handleDBExceptions(error, this.logger);
    }
  }
}
