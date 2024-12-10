import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashing } from 'src/services/hashing';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {

    try {
      const {username, email, password} = createUser
      const hash = await hashing(password)
      return await this.userRepository.save({ username, email, hash });
    } catch (error) {
      if(error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException("Username or Email already exists")
      }
      throw error;
    }

  }

  async findOne(userDto: UserDto) {
    try {
      const {email, password} = userDto
      const user = await this.userRepository.find({
        where: {email}
      })

    } catch (error) {
      
    }
  }

  async remove(id: number) {
    try {
      const deleteUser = await this.userRepository.delete(id)
      if(deleteUser.affected === 0) {
        throw new InternalServerErrorException("This user could not be deleted successfully. Try again later")
      }
      return "User deleted successfully"
    } catch (error) {
    
      if(error instanceof InternalServerErrorException) throw error
      console.error(error)
    }
  }
}
