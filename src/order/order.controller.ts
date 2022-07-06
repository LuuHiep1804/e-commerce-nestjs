import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { OrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/')
    async create(@Request() req) {
        const userId = req.user.userId;
        const order = await this.orderService.createOrder(userId);
        return order;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Put('/cancel/:id')
    async cancel(@Param('id') orderId: string) {
        const order = await this.orderService.cancelOrder(orderId);
        return order;
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('/:id')
    async update(@Param('id') orderId: string, @Body() orderDTO: OrderDTO) {
        const order = await this.orderService.updateOrder(orderId, orderDTO);
        return order;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/')
    async findAllOrder() {
        const orders = await this.orderService.findAllOrder();
        return orders;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/by-user/:id')
    async findOrderByUser(@Param('id') userId: string) {
        const orders = await this.orderService.findOrderByUser(userId);
        return orders;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/:id')
    async findSingleOrder(@Param('id') orderId: string) {
        const order = await this.orderService.findSingleOrder(orderId);
        return order;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id')
    async deleteOrder(@Param('id') orderId: string) {
        const order = await this.orderService.deleteOrder(orderId);
        return order;
    }

}
