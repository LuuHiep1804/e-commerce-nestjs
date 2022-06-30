import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CartService } from './cart.service';
import { ItemDTO } from './item.dto';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/')
    async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
        const userId = req.user.userId;
        const cart = await this.cartService.addItemToCart(userId, itemDTO);
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/')
    async removeItemFromCart(@Request() req, @Body() { productId }) {
        const userId = req.user.userId;
        const cart = await this.cartService.removeItemFromCart(userId, productId);
        return cart;
    }

    @Delete('/:id')
    async deleteCart(@Param('id') userId: string) {
        const cart = await this.cartService.deleteCart(userId);
        return cart;
    }

}
