import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../../entities/Product.entity';
import { Review } from '../../entities/Review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
