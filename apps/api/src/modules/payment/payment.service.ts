import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../../entities/Payment.entity';
import { Order } from '../../entities/Order.entity';

@Injectable()
export class PaymentService {
  private paystackApiUrl = 'https://api.paystack.co';
  private paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private httpService: HttpService,
  ) {}

  async initializePayment(orderId: string, amount: number, email: string) {
    try {
      const reference = `order_${orderId}_${Date.now()}`;

      const response = await this.httpService
        .post(
          `${this.paystackApiUrl}/transaction/initialize`,
          {
            email,
            amount: Math.round(amount * 100), // Paystack uses kobo (hundredths of naira)
            reference,
            metadata: {
              orderId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
            },
          },
        )
        .toPromise();

      // Save payment record
      const payment = this.paymentRepository.create({
        orderId,
        amount,
        paystackReference: reference,
        status: PaymentStatus.PENDING,
      });

      await this.paymentRepository.save(payment);

      return {
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference,
      };
    } catch (error) {
      throw new BadRequestException('Failed to initialize payment');
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await this.httpService
        .get(`${this.paystackApiUrl}/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
          },
        })
        .toPromise();

      const { status, reference: paystackRef, amount } = response.data.data;

      // Update payment record
      const payment = await this.paymentRepository.findOne({
        where: { paystackReference: paystackRef },
      });

      if (payment) {
        payment.status = status === 'success' ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
        payment.transactionId = paystackRef;
        await this.paymentRepository.save(payment);

        // Update order status
        if (status === 'success') {
          const order = await this.orderRepository.findOne({ where: { id: payment.orderId } });
          if (order) {
            order.status = 'processing';
            await this.orderRepository.save(order);
          }
        }
      }

      return {
        success: status === 'success',
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify payment');
    }
  }

  async getPaymentStatus(reference: string) {
    const payment = await this.paymentRepository.findOne({
      where: { paystackReference: reference },
      relations: ['order'],
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    return payment;
  }

  async listPayments(skip = 0, take = 10) {
    return this.paymentRepository.find({
      skip,
      take,
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }
}
