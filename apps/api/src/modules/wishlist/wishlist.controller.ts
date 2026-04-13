import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req: any) {
    return this.wishlistService.getUserWishlist(req.user.userId);
  }

  @Post(':productId')
  addToWishlist(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.userId, productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }

  @Get('check/:productId')
  checkWishlist(@Req() req: any, @Param('productId') productId: string) {
    return this.wishlistService.isInWishlist(req.user.userId, productId);
  }
}
