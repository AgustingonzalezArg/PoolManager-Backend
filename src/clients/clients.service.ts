import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { Cron } from '@nestjs/schedule';
import { Key } from 'readline';

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
          return []
        }
        return clients
      } catch (error) {
        console.log(error.message)
        throw error
      }
  }

//   async findCleanToday(idUser: number): Promise<Client[] | string> {
//     try {
//       const clients = await this.clientRepository.find({
//         where: {user: {id: idUser}, CleanToday: true}
        
//       });
//       if(clients.length <= 0) {
//         return "not found clients"
//       }
//       return clients
//     } catch (error) {
//       console.log(error.message)
//       throw error
//     }
// }

  async update(idUser: number, updateClient: UpdateClientDto): Promise<Client> {
    const {id} = updateClient 
    try {
      const client = await this.clientRepository.findOne(
        {where: {user: {id: idUser}, id}}
      )
      if(!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      Object.assign(client, updateClient)
      return await this.clientRepository.save(client)
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  // async updateCleanToday(idUser: number, arrayIds: Key[]): Promise<Client[]> {
  //   try {
  //     const clients = await  this.clientRepository.find({
  //       where: {user: {id: idUser}, id: In(arrayIds), CleanToday: false}
  //     })
  //     if(clients.length <= 0) throw new NotFoundException("no clients found for add 'clean today'")
  //     clients.forEach(client => client.CleanToday = true)
  //     return await this.clientRepository.save(clients)
  //   } catch (error) {
  //     console.log(error.message)
  //     throw error
  //   }
  // }

  // async updateCleanTomorrow(idUser: number, arrayIds: Key[]): Promise<Client[]> {
  //   try {
  //     const clients = await  this.clientRepository.find({
  //       where: {user: {id: idUser}, id: In(arrayIds), CleanTomorrow: false}
  //     })
  //     if(clients.length <= 0) throw new NotFoundException("no clients found for add 'clean tomorrow'")
  //     clients.forEach(client => client.CleanTomorrow = true)
  //     return await this.clientRepository.save(clients)
  //   } catch (error) {
  //     console.log(error.message)
  //     throw error
  //   }
  // }

  async remove(idUser: number, id): Promise<number> {
    try {
      const clientDeleted = await  this.clientRepository.delete({user: {id: idUser}, id})
      if(clientDeleted.affected <= 0 ) {
        throw new InternalServerErrorException("This client could not be deleted successfully. Try again later")
      }
      return clientDeleted.affected
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

}
