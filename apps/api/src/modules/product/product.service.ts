import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/Product.entity';
import { Review } from '../../entities/Review.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findAll(skip = 0, take = 10) {
    return this.productRepository.find({ skip, take, where: { isActive: true } });
  }

  async findById(id: string) {
    return this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['reviews'],
    });
  }

  async search(query: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere(
        '(product.name ILIKE :query OR product.description ILIKE :query)',
        { query: `%${query}%` },
      )
      .limit(10)
      .getMany();
  }

  async findByCategory(category: string, skip = 0, take = 10) {
    return this.productRepository.find({
      where: { category, isActive: true },
      skip,
      take,
    });
  }

  async filterProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'price' | 'rating' | 'newest';
    skip?: number;
    take?: number;
  }) {
    const { category, minPrice, maxPrice, minRating, sortBy, skip = 0, take = 10 } = filters;

    let query = this.productRepository.createQueryBuilder('product').where('product.isActive = :isActive', {
      isActive: true,
    });

    if (category) {
      query = query.andWhere('product.category = :category', { category });
    }

    if (minPrice !== undefined) {
      query = query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query = query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (minRating !== undefined) {
      query = query.andWhere('product.rating >= :minRating', { minRating });
    }

    // Add sorting
    if (sortBy === 'price') {
      query = query.orderBy('product.price', 'ASC');
    } else if (sortBy === 'rating') {
      query = query.orderBy('product.rating', 'DESC');
    } else if (sortBy === 'newest') {
      query = query.orderBy('product.createdAt', 'DESC');
    }

    return query.skip(skip).take(take).getMany();
  }

  async getCategories() {
    const products = await this.productRepository.find({
      where: { isActive: true },
      select: ['category'],
    });
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return categories;
  }

  async create(data: Partial<Product>) {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: string, data: Partial<Product>) {
    await this.productRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.productRepository.update(id, { isActive: false });
  }

  async addReview(productId: string, userId: string, rating: number, comment?: string) {
    const review = this.reviewRepository.create({
      productId,
      userId,
      rating,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update product rating
    const reviews = await this.reviewRepository.find({ where: { productId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.productRepository.update(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    return savedReview;
  }

  async listAllProducts(skip = 0, take = 10) {
    return this.productRepository.find({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }
}
