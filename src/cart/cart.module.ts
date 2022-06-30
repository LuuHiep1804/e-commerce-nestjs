import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from 'src/models/cart.schema';
import { ProductSchema } from 'src/models/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema}, { name: 'Product', schema: ProductSchema}]),
  ],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
