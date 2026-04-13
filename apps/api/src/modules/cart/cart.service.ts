import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../entities/Cart.entity';
import { CartItem } from '../../entities/CartItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async getCart(userId: string) {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  async getOrCreateCart(userId: string) {
    let cart = await this.getCart(userId);
    if (!cart) {
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      return this.cartItemRepository.save(existingItem);
    }

    const item = this.cartItemRepository.create({
      cartId: cart.id,
      productId,
      quantity,
    });
    return this.cartItemRepository.save(item);
  }

  async removeItem(cartItemId: string) {
    return this.cartItemRepository.delete(cartItemId);
  }

  async updateItemQuantity(cartItemId: string, quantity: number) {
    await this.cartItemRepository.update(cartItemId, { quantity });
    return this.cartItemRepository.findOne({ where: { id: cartItemId } });
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    if (cart) {
      await this.cartItemRepository.delete({ cartId: cart.id });
    }
  }
}
