import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Cart } from './Cart.entity';
import { Product } from './Product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @Column('uuid')
  productId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @CreateDateColumn()
  addedAt: Date;
}
