import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/types/product';
import { Cart } from '../types/cart';
import { ItemDTO } from './item.dto';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>,
                @InjectModel('Product') private readonly productModel: Model<Product>) {}
    
      async getCart(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId });
        if(!cart) {
          throw new NotFoundException('Cart does not exist');
        }
        return cart;
      }
    
      async deleteCart(userId: string): Promise<Cart> {
        const deletedCart = await this.cartModel.findOneAndRemove({ userId });
        if(!deletedCart) {
          throw new NotFoundException('Cart does not exist');
        }
        return deletedCart;
      }
    
      private recalculateCart(cart: Cart) {
        cart.totalPrice = 0;
        cart.items.forEach(item => {
          cart.totalPrice += (item.quantity * item.price);
        })
      }
    
      async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
        const { productId, quantity } = itemDTO;
        
        let cart = await this.cartModel.findOne({ userId: userId });
        if(!cart) {
          let totalPrice = 0;
          cart = await this.cartModel.create({
            userId,
            items: [],
            totalPrice
          });
        }

        const product = await this.productModel.findById(productId);
        if(!product) {
          throw new NotFoundException('Product does not exist');
        }else {
          const itemIndex = cart.items.findIndex((item) => item.productId == productId);
          if(itemIndex == -1) {
            const newItem = {
              productId: productId,
              name: product.name,
              quantity: quantity,
              price: product.price
            }
            const subTotalPrice = quantity * newItem.price;
            cart.items.push({...newItem, subTotalPrice});
            this.recalculateCart(cart);
          }else{
            let item = cart.items[itemIndex];
            item.quantity = Number(item.quantity) + Number(quantity);
            item.subTotalPrice = item.quantity * item.price;

            cart.items[itemIndex] = item;
            this.recalculateCart(cart);
          }
          const updateCart = await this.cartModel.findOneAndUpdate({userId: userId}, cart, {new: true});
          return updateCart;
        }
      }
    
      async removeItemFromCart(userId: string, productId: string): Promise<any> {
        const cart = await this.cartModel.findOne({ userId: userId });
        if(!cart) {
          throw new NotFoundException('Cart does not exist');
        }
        const itemIndex = cart.items.findIndex((item) => item.productId == productId);
    
        if (itemIndex > -1) {
          cart.items.splice(itemIndex, 1);
          this.recalculateCart(cart);
          return await cart.save();
        }else{
          throw new NotFoundException('Cannot find this product in cart');
        }
      }

}
