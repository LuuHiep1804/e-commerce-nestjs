import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { PaymentDTO } from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post('/')
    async create(@Body() body) {
        const payment = await this.paymentService.create(body.orderId);
        return payment;
    }

    @Put('/:id')
    async update(@Param('id') paymentId: string, @Body() paymentDTO: PaymentDTO) {
        const payment = await this.paymentService.update(paymentId, paymentDTO);
        return payment;
    }
}
