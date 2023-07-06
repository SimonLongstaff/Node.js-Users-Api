import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOne(@Param() UpdateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.findOne(UpdateUserDto.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(CreateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param() UpdateUserDto: UpdateUserDto,
    @Body() CreateUserDto: CreateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.update(UpdateUserDto.id, CreateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param() UpdateUserDto: UpdateUserDto): Promise<DeleteResult> {
    return this.usersService.remove(UpdateUserDto);
  }
}
