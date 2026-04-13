import { Controller, Get, Post, Put, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  getOrders(@Req() req: any) {
    return this.orderService.getUserOrders(req.user.userId);
  }

  @Get('tracking/:id')
  getOrderTracking(@Param('id') id: string) {
    return this.orderService.getOrderTracking(id);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }

  @Post()
  createOrder(
    @Req() req: any,
    @Body() body: { cartItems: any[]; totalAmount: number; shippingAddress: string },
  ) {
    return this.orderService.createOrder(
      req.user.userId,
      body.cartItems,
      body.totalAmount,
      body.shippingAddress,
    );
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; trackingNumber?: string },
  ) {
    return this.orderService.updateOrderStatus(id, body.status as any, body.trackingNumber);
  }

  @Put(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}

@Controller('admin/orders')
@UseGuards(AuthGuard('jwt'))
export class AdminOrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  listAllOrders(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.orderService.listAllOrders(skip, take);
  }

  @Get('stats')
  getOrderStats() {
    return this.orderService.getOrderStats();
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; trackingNumber?: string },
  ) {
    return this.orderService.updateOrderStatus(id, body.status as any, body.trackingNumber);
  }
}
