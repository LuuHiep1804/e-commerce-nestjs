import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/types/cart';
import { Order } from 'src/types/order';
import { User } from 'src/types/user';
import { Product } from 'src/types/product';
import { OrderDTO } from './order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<Order>,
        @InjectModel('Cart') private readonly cartModel: Model<Cart>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Product') private readonly productModel: Model<Product>,
    ) {}

        async createOrder(userId: string): Promise<Order> {
            const cart = await this.cartModel.findOne({ userId: userId});
            if(!cart) {
                throw new NotFoundException('Cart does not exist');
            }
            const user = await this.userModel.findById(userId);
            const newOrder = await this.orderModel.create({
                userId,
                items: cart.items,
                amount: cart.totalPrice,
                address: user.address,
                phone: user.phone
            });
            await newOrder.save();
            //làm trống giỏ hàng
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
            //cập nhật lại tổng sản phẩm trong kho
            for(let i = 0; i < newOrder.items.length; i++) {
                let product = await this.productModel.findById(newOrder.items[i].productId);
                if(Number(product.quantityInStock) < Number(newOrder.items[i].quantity)) {
                    throw new BadRequestException('Not enough products quantity');
                }
                let quantityInStock = Number(product.quantityInStock) - Number(newOrder.items[i].quantity);
                product.quantityInStock = quantityInStock;
                await product.save();
            }
            return newOrder;
        }

        async updateOrder(orderId: string, orderDTO: OrderDTO): Promise<Order> {
            const checkAvailable = await this.orderModel.findById(orderId);
            if(!checkAvailable) {
                throw new NotFoundException('Order does not exist');
            }
            const { status } = orderDTO;
            const order = await this.orderModel.findByIdAndUpdate({_id: orderId}, {status: status}, {new: true});
            //cập nhật lại tổng sản phẩm trong kho
            if(status === 'Cancelled' && checkAvailable.status !== 'Cancelled') {
                for(let i = 0; i < order.items.length; i++) {
                    let product = await this.productModel.findById(order.items[i].productId);
                    let quantityInStock = Number(product.quantityInStock) + Number(order.items[i].quantity);
                    product.quantityInStock = quantityInStock;
                    await product.save();
                }
            }
            return order;
        }

        async cancelOrder(orderId: string): Promise<Order> {
            const order = await this.orderModel.findById(orderId);
            if(!order) {
                throw new NotFoundException('Order does not exist');
            }
            if(order.status !== 'Not processed') {
                throw new BadRequestException('Can not cancel order');
            }else {
                order.status = 'Cancelled';
                await order.save();
                for(let i = 0; i < order.items.length; i++) {
                    let product = await this.productModel.findById(order.items[i].productId);
                    let quantityInStock = Number(product.quantityInStock) + Number(order.items[i].quantity);
                    product.quantityInStock = quantityInStock;
                    await product.save();
                }
            }
            return order;
        }

        async findAllOrder(): Promise<Order[]> {
            const orders = await this.orderModel.find({}).sort({ _id: -1});
            if(!orders) {
                throw new NotFoundException('Not found');
            }
            return orders;
        }

        async findOrderByUser(userId: string): Promise<Order[]> {
            const orders = await this.orderModel.find({ userId: userId });
            if(!orders) {
                throw new NotFoundException('Not found');
            }
            return orders;
        }

        async findSingleOrder(orderId): Promise<Order> {
            const order = await this.orderModel.findById(orderId);
            if(!order) {
                throw new NotFoundException('Order does not exist');
            }
            return order;
        }

        async deleteOrder(orderId): Promise<Order> {
            const order = await this.orderModel.findByIdAndDelete(orderId);
            if(!order) {
                throw new NotFoundException('Order does not exist');
            }
            return order;
        }

}
