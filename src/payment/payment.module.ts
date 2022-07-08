import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from 'src/models/payment.schema';
import { OrderSchema } from 'src/models/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Payment', schema: PaymentSchema},
      {name: 'Order', schema: OrderSchema}
    ])
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
