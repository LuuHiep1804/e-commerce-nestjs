import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/models/order.schema';
import { CartSchema } from 'src/models/cart.schema';
import { UserSchema } from 'src/models/user.schema';
import { ProductSchema } from 'src/models/product.schema';
import { ProductService } from 'src/product/product.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema},
      { name: 'Cart', schema: CartSchema},
      {name: 'User', schema: UserSchema},
      {name: 'Product', schema: ProductSchema}
    ])
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
