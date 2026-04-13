import { DataSource } from 'typeorm';
import { User } from './entities/User.entity';
import { Product } from './entities/Product.entity';
import { Cart } from './entities/Cart.entity';
import { CartItem } from './entities/CartItem.entity';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { Review } from './entities/Review.entity';
import * as bcrypt from 'bcryptjs';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ecommerce',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [User, Product, Cart, CartItem, Order, OrderItem, Review],
});

export async function seedDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);

  // Seed users
  const existingUsers = await userRepository.find();
  if (existingUsers.length === 0) {
    const users = [
      {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: await bcrypt.hash('password123', 10),
        isAdmin: false,
      },
      {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        passwordHash: await bcrypt.hash('admin123', 10),
        isAdmin: true,
      },
    ];

    for (const user of users) {
      await userRepository.save(userRepository.create(user));
    }
  }

  // Seed products
  const existingProducts = await productRepository.find();
  if (existingProducts.length === 0) {
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        stock: 50,
        category: 'Electronics',
        rating: 4.5,
        reviewCount: 120,
        images: ['https://via.placeholder.com/300?text=Headphones'],
        isActive: true,
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 299.99,
        stock: 30,
        category: 'Electronics',
        rating: 4.7,
        reviewCount: 89,
        images: ['https://via.placeholder.com/300?text=SmartWatch'],
        isActive: true,
      },
      {
        name: 'USB-C Cable',
        description: 'Durable USB-C charging cable, 6ft length',
        price: 19.99,
        stock: 200,
        category: 'Accessories',
        rating: 4.2,
        reviewCount: 534,
        images: ['https://via.placeholder.com/300?text=USBCable'],
        isActive: true,
      },
      {
        name: 'Portable Power Bank',
        description: '20000mAh portable power bank with fast charging',
        price: 49.99,
        stock: 75,
        category: 'Accessories',
        rating: 4.6,
        reviewCount: 312,
        images: ['https://via.placeholder.com/300?text=PowerBank'],
        isActive: true,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard for gaming and typing',
        price: 129.99,
        stock: 40,
        category: 'Electronics',
        rating: 4.8,
        reviewCount: 267,
        images: ['https://via.placeholder.com/300?text=Keyboard'],
        isActive: true,
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 45.99,
        stock: 100,
        category: 'Electronics',
        rating: 4.4,
        reviewCount: 198,
        images: ['https://via.placeholder.com/300?text=Mouse'],
        isActive: true,
      },
    ];

    for (const product of products) {
      await productRepository.save(productRepository.create(product));
    }
  }

  console.log('Database seeded successfully!');
}
