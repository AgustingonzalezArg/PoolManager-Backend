import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @Post(':id')
  create(@Param('id') idUser: string ,@Body() createPayments: CreatePaymentDto[]) {
    return this.paymentsService.create(+idUser, createPayments);
  }

  @Get('/notpayments/:id')
  findOnlyNotPayments(@Param('id') id: string,) {
    return this.paymentsService.findOnlyNotPayments(+id);
  }

  @Get(':id')
  findAll(@Param('id') id: string,) {
    return this.paymentsService.findAll(+id);
  }

  @Get('day/:id/:date')
  findPerDay(@Param('id') id: string, @Param('date') date: string) {
    return this.paymentsService.findPerDay(+id, date)
  }

  @Get('month/:id/:month')
  findPerMonth(@Param('id') id: string, @Param('month') month: string) {
    return this.paymentsService.findPerMonth(+id, +month)
  }


  @Patch(':id')
  update(@Param('id') userId: string, @Body() arrayUpdate: UpdatePaymentDto[]) {
    return this.paymentsService.update(+userId, arrayUpdate);
  }

  @Delete('delete/:id')
  remove(@Param('id') userId: string, @Body('paymentId') id: number) {
    return this.paymentsService.remove(+userId, id);
  }
}
