import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from '../types/cart';
import { ItemDTO } from './item.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

    async createCart(userId: string, itemDTO: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<Cart> {
        const newCart = await this.cartModel.create({
          userId,
          items: [{ ...itemDTO, subTotalPrice }],
          totalPrice
        });
        await newCart.save();
        return newCart;
      }
    
      async getCart(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId });
        return cart;
      }
    
      async deleteCart(userId: string): Promise<Cart> {
        const deletedCart = await this.cartModel.findOneAndRemove({ userId });
        return deletedCart;
      }
    
      private recalculateCart(cart: Cart) {
        cart.totalPrice = 0;
        cart.items.forEach(item => {
          cart.totalPrice += (item.quantity * item.price);
        })
      }
    
      async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
        const { productId, quantity, price } = itemDTO;
        const subTotalPrice = quantity * price;
        
        const cart = await this.cartModel.findOne({ userId: userId });

        if (cart) {
          const itemIndex = cart.items.findIndex((item) => item.productId == productId);
    
          if (itemIndex > -1) {
            let item = cart.items[itemIndex];
            item.quantity = Number(item.quantity) + Number(quantity);
            item.subTotalPrice = item.quantity * item.price;
    
            cart.items[itemIndex] = item;
            this.recalculateCart(cart);
            return await cart.save();
          } else {
            cart.items.push({ ...itemDTO, subTotalPrice });
            this.recalculateCart(cart);
            return await cart.save();
          }
        } else {
          const newCart = await this.createCart(userId, itemDTO, subTotalPrice, subTotalPrice);
          return newCart;
        }
      }
    
      async removeItemFromCart(userId: string, productId: string): Promise<any> {
        const cart = await this.cartModel.findOne({ userId: userId });
        const itemIndex = cart.items.findIndex((item) => item.productId == productId);
    
        if (itemIndex > -1) {
          cart.items.splice(itemIndex, 1);
          return await cart.save();
        }
      }

}
