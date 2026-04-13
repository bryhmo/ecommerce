import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() body: { productId: string; quantity: number }) {
    return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Put('items/:id')
  updateItem(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItemQuantity(id, body.quantity);
  }

  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}
