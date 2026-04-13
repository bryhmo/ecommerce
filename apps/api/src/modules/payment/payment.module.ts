import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.controller';
import { PaymentController } from './payment.controller';
import { Payment } from '../../entities/Payment.entity';
import { Order } from '../../entities/Order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order]), HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
