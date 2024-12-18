import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';

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

  async create(idUser, createPaymentDto: CreatePaymentDto): Promise<Payment> {

    const {idClient, ...rest} = createPaymentDto  
    try {
      const user = await this.userRepository.findOne({
        where: {id: idUser}
      }) 
      if(!user) throw new NotFoundException("This user not found")
      const client = await this.clientRepository.findOne({
        where: {id: idClient}
      })
      if(!client) throw new NotFoundException("this client not found")
      const newPayment = await this.paymentRepository.create({...rest, user, client})
      return await this.paymentRepository.save(newPayment)
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

  async update(userId: number, arrayUpdate: {check: number[]}): Promise<Payment[]> {
   const {check} = arrayUpdate
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException("This user not found");
      console.log(arrayUpdate)
      await this.paymentRepository.update(
        {id: In(check)},
        {payment: true }
      )
      return await this.findOnlyNotPayments(userId)
    } catch (error) {
      console.log(error.message)
      throw error 
    }
  }

  async remove(userId: number, paymentId: number): Promise<string> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: {id: paymentId, user: {id: userId}}
      })
      if(!payment) throw new NotFoundException("this payment not found")
      const paymentDelete = await this.paymentRepository.delete({id: paymentId})
      if(paymentDelete.affected <= 0) throw new InternalServerErrorException("this payment could not be removed. Try again later");
      return "Payment deleted!"
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }
}
