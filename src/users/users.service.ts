import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { v4 as UUID } from 'uuid';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(CreateUserDto);
    user.id = UUID();
    return await this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findBy({ id }).then((user) => {
      return user[0];
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository
      .findBy({ name: username })
      .then((user) => {
        return user[0];
      });
  }

  async update(
    id: string,
    CreateUserDto: CreateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update(id, CreateUserDto);
  }

  async remove(DeleteUserDtp: UpdateUserDto): Promise<DeleteResult> {
    return this.usersRepository.delete(DeleteUserDtp.id);
  }
}
