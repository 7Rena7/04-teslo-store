import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProductImage } from './';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { GENDERS } from '../dto/create-product.dto';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '0f803ceb-769b-4f45-95b8-c31cb29419f0',
    description: 'The unique identifier of the product',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Nike Air Max 90',
    description: 'The title of the product',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 100.0,
    description: 'The price of the product',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'The best shoe ever',
    description: 'The description of the product',
    nullable: true,
    default: '',
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'nike-air-max-90',
    description: 'The slug of the product',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    type: 'integer',
    default: 0,
    example: 0,
    description: 'The stock of the product',
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['40', '41', '42'],
    description: 'The sizes of the product',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'male',
    description: 'The gender of the product',
    enum: GENDERS,
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['running', 'sport', 'nike'],
    description: 'The tags of the product',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    description: 'The images of the product',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @Column('bool', { default: true })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll('!', '')
      .replaceAll('?', '')
      .replaceAll('.', '');
  }
}
