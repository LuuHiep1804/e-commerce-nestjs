import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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

}
