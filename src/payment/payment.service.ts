import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/types/order';
import { Payment } from '../types/payment';
import { PaymentDTO } from './payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
        @InjectModel('Order') private readonly orderModel: Model<Order>
    ) {}

    async create(orderId: string): Promise<Payment> {
        const order = await this.orderModel.findById(orderId);
        if(!order) {
            throw new HttpException('Order does not exist', HttpStatus.BAD_REQUEST);
        }
        const payment = await this.paymentModel.create({
            orderId: order._id,
            userId: order.userId,
            amount: order.amount,
            created_at: Date.now()
        });
        await payment.save();
        return payment;
    }

    async update(paymentId: string, paymentDTO: PaymentDTO): Promise<Payment> {
        const payment = await this.paymentModel.findByIdAndUpdate(paymentId, paymentDTO, {new: true});
        if(!payment) {
            throw new HttpException('Payment does not exist', HttpStatus.BAD_REQUEST);
        }
        return payment;
    }

}
