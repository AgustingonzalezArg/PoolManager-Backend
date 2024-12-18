import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ClientsService {
  constructor( 
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(idUser: number, createClientDto: CreateClientDto) {
    try {
      const user = await this.userRepository.findOne({where: {id: idUser}})
      if(!user) {
        throw new NotFoundException("This user not found");
      }

      const newClient = await this.clientRepository.create({...createClientDto, user});
      return await this.clientRepository.save(newClient)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findAll(idUser: number): Promise<Client[] | string> {
      try {
        const clients = await this.clientRepository.find({
          where: {user: {id: idUser}}
        });
        if(clients.length <= 0) {
          return "not found clients"
        }
        return clients
      } catch (error) {
        console.log(error.message)
        throw error
      }
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    try {
      const client = await this.clientRepository.findOne({where: {id}})
      if(!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      Object.assign(client, updateClientDto)
      return await this.clientRepository.save(client)
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const clientDeleted = await  this.clientRepository.delete({id})
      if(clientDeleted.affected <= 0 ) {
        throw new InternalServerErrorException("This client could not be deleted successfully. Try again later")
      }
      return `client with id ${id} deleted`
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  @Cron('0 00 00 * * *')
  async updateCleansPools() {
    try {
      const listToday = await this.clientRepository.find({
        where: {CleanToday: true}
      })
      const listTomorrow = await this.clientRepository.find({
        where: {CleanTomorrow : true}
      })
      listToday.forEach(client => client.CleanToday = false)
      listTomorrow.forEach(client => {
        client.CleanTomorrow = false
        client.CleanToday = true
      })
      const saveListToday = await this.clientRepository.save(listToday)
      const saveListTomorrow = await this.clientRepository.save(listTomorrow)
      console.log("Lists updated")
      return {saveListToday, saveListTomorrow}
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }
}
