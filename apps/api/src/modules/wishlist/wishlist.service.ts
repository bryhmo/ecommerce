import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../../entities/Wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async addToWishlist(userId: string, productId: string) {
    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (existing) {
      return { message: 'Product already in wishlist' };
    }

    const wishlistItem = this.wishlistRepository.create({
      userId,
      productId,
    });

    return this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(userId: string, productId: string) {
    return this.wishlistRepository.delete({
      userId,
      productId,
    });
  }

  async getUserWishlist(userId: string) {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product'],
      order: { addedAt: 'DESC' },
    });
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });
    return !!item;
  }

  async clearWishlist(userId: string) {
    return this.wishlistRepository.delete({ userId });
  }
}
