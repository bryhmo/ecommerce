import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/Order.entity';
import { OrderItem } from '../../entities/OrderItem.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private emailService: EmailService,
  ) {}

  async createOrder(userId: string, cartItems: any[], totalAmount: number, shippingAddress: string) {
    const order = this.orderRepository.create({
      userId,
      totalAmount,
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const item of cartItems) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      });
      await this.orderItemRepository.save(orderItem);
    }

    return this.getOrderDetails(savedOrder.id);
  }

  async getOrderDetails(orderId: string) {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user', 'payments'],
    });
  }

  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    const updatedOrder = await this.orderRepository.save(order);

    // Send email notifications based on status
    if (status === OrderStatus.PROCESSING) {
      await this.emailService.sendOrderConfirmationEmail(order.user.email, order.id, order.totalAmount);
    } else if (status === OrderStatus.SHIPPED && trackingNumber) {
      await this.emailService.sendShippingNotificationEmail(order.user.email, order.id, trackingNumber);
    } else if (status === OrderStatus.DELIVERED) {
      await this.emailService.sendDeliveryConfirmationEmail(order.user.email, order.id);
    }

    return this.getOrderDetails(orderId);
  }

  async cancelOrder(orderId: string) {
    return this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
  }

  async getOrderTracking(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payments'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      orderId: order.id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      payments: order.payments,
    };
  }

  async listAllOrders(skip = 0, take = 10) {
    return this.orderRepository.find({
      skip,
      take,
      relations: ['user', 'items', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderStats() {
    const orders = await this.orderRepository.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount as any), 0);
    const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING).length;
    const completedOrders = orders.filter((o) => o.status === OrderStatus.DELIVERED).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
  }
}
