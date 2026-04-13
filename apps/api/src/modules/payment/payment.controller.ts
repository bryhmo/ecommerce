import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initialize')
  initializePayment(
    @Body() body: { orderId: string; amount: number; email: string },
  ) {
    return this.paymentService.initializePayment(body.orderId, body.amount, body.email);
  }

  @Get('verify/:reference')
  verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  @Get('status/:reference')
  getPaymentStatus(@Param('reference') reference: string) {
    return this.paymentService.getPaymentStatus(reference);
  }

  @Get()
  listPayments(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.paymentService.listPayments(skip, take);
  }
}
