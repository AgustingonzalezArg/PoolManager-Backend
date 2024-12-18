import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id')
  create(@Param('id') idUser: string ,@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(+idUser, createPaymentDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string,) {
    return this.paymentsService.findAll(+id);
  }

  @Get('/notpayments/:id')
  findOnlyNotPayments(@Param('id') id: string,) {
    return this.paymentsService.findOnlyNotPayments(+id);
  }

  @Patch(':id')
  update(@Param('id') userId: string, @Body() arrayUpdate: {check: number[]}) {
    return this.paymentsService.update(+userId, arrayUpdate);
  }

  @Delete(':id')
  remove(@Param('id') userId: string, @Body('paymentId') paymentId: number) {
    return this.paymentsService.remove(+userId, paymentId);
  }
}
