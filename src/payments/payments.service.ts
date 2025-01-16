import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { UpdateClientDto } from 'src/clients/dto/update-client.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    readonly paymentRepository : Repository<Payment>,
 
    @InjectRepository(User)
    readonly userRepository : Repository<User>,

    @InjectRepository(Client)
    readonly clientRepository: Repository<Client>
  ) {}

  async create(idUser, createPayments: CreatePaymentDto[]): Promise<Payment[]> {
    console.log(createPayments)
    try {
      const user = await this.userRepository.findOne({
        where: {id: idUser}
      }) 
      if(!user) throw new NotFoundException("This user not found")

        const payments = await Promise.all(
          createPayments.map(async (payment: CreatePaymentDto) => {
            const client = await this.clientRepository.findOne({
            where: {id: payment.idClient}
          })
          if(!client) throw new NotFoundException(`user with ${payment.idClient} not found`)
          const {date, price, payment: pay, cleaning} = payment
          return this.paymentRepository.create({
        date,
        price,
        payment: pay,
        cleaning,
        user,
        client})
        })
      )
        console.log(payments)
      return await this.paymentRepository.save(payments)
    } catch (error) {
      console.log(error.message)
      throw error 
    }
  }

  async findAll(idUser: number): Promise<Payment[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idUser },
      });
      if (!user) throw new NotFoundException("This user not found");

      return await this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.client', 'client')
        .where('payment.userId = :userId', {userId: idUser})
        .getMany()
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async findPerDay(idUser: number, date: string): Promise<Payment[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idUser },
      });
      if (!user) throw new NotFoundException("This user not found");

      return await this.paymentRepository
        .createQueryBuilder('payments')
        .leftJoinAndSelect('payments.client', 'client')
        .where('DATE(payments.date) = :date', {date})
        .andWhere('payments.userId = :idUser', {idUser})
        .getMany()
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async findPerMonth(idUser: number, month: number): Promise<Payment[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idUser },
      });
      if (!user) throw new NotFoundException("This user not found");

      return await this.paymentRepository
        .createQueryBuilder('payments')
        .leftJoinAndSelect('payments.client', 'client')
        .where('MONTH(payments.date) = :month', {month})
        .andWhere('payments.userId = :idUser', {idUser})
        .getMany()
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async findOnlyNotPayments(idUser: number): Promise<Payment[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: idUser },
      });
      if (!user) throw new NotFoundException("This user not found");

      return await this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.client', 'client')
        .where('payment.userId = :userId', {userId: idUser})
        .andWhere('payment.payment = :payment', {payment: false})
        .getMany()
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async update(userId: number, arrayUpdate: UpdatePaymentDto[] ): Promise<any[]> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException("This user not found");
      const UpdatePayments = await Promise.all(
        arrayUpdate.map(async (payment: UpdatePaymentDto) => {
          const pay = await this.paymentRepository.findOne({
            where: {id: payment.id}
          })
          if(!pay) throw new NotFoundException("Payment not found")
          if(payment.cleaning){
            return await this.paymentRepository.update(
          {id: payment.id},
          {payment: payment.payment, cleaning: payment.cleaning}
          )} else {
            return await this.paymentRepository.update(
              {id: payment.id},
              {payment: payment.payment}
          )}
      })
    )
      return await UpdatePayments
    } catch (error) {
      console.log(error.message)
      throw error 
    }
  }

  async remove(userId: number, id: number): Promise<number> {
    console.log(id)
    try {
      const paymentDeleted = await  this.paymentRepository.delete({user: {id: userId}, id})
      if(paymentDeleted.affected <= 0) throw new InternalServerErrorException("this payment could not be removed. Try again later");
      return paymentDeleted.affected
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }
}
