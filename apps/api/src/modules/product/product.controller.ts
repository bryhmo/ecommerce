import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.productService.findAll(skip, take);
  }

  @Get('search')
  searchProducts(@Query('q') query: string) {
    return this.productService.search(query);
  }

  @Get('categories')
  getCategories() {
    return this.productService.getCategories();
  }

  @Get('filter')
  filterProducts(
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
    @Query('sortBy') sortBy?: 'price' | 'rating' | 'newest',
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ) {
    return this.productService.filterProducts({
      category,
      minPrice: minPrice ? parseFloat(minPrice as any) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as any) : undefined,
      minRating: minRating ? parseFloat(minRating as any) : undefined,
      sortBy,
      skip: parseInt(skip as any),
      take: parseInt(take as any),
    });
  }

  @Get('category/:category')
  getByCategory(@Param('category') category: string, @Query('skip') skip = 0, @Query('take') take = 10) {
    return this.productService.findByCategory(category, skip, take);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createProduct(@Body() data: any) {
    return this.productService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @Post(':id/reviews')
  @UseGuards(AuthGuard('jwt'))
  addReview(@Param('id') id: string, @Body() data: any) {
    return this.productService.addReview(id, data.userId, data.rating, data.comment);
  }
}
