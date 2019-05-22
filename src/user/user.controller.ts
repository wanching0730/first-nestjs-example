import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import {UserEntity} from './user.entity';
import {DeleteResult} from 'typeorm';

@ApiBearerAuth()
@ApiUseTags('user')
@Controller()
export class UserController {
    // dependency injection
    constructor(private readonly userService: UserService) {}

    @Get('user')
    async find(@User('email') email: string): Promise<UserRO> {
        return await this.userService.findByEmail(email);
        // return await this.userService.findHello("hello");
    }

    // Register
    @UsePipes(new ValidationPipe())
    @Post('user')
    async create (@Body('user') userData: CreateUserDto): Promise<UserRO> {
        return this.userService.create(userData);
    }

    @Put('user')
    async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto): Promise<UserEntity> {
        return await this.userService.update(userId, userData);
    }

    @Delete('user/:email')
    async delete(@Param() params): Promise<DeleteResult> {
        return await this.userService.delete(params.email);
    }

    @UsePipes(new ValidationPipe())
    @Post('user/login')
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
        const user = await this.userService.findOne(loginUserDto);

        // User from decorator.ts
        const errors = {User: ' not found'};
        if (!user) throw new HttpException({errors}, 401);

        const token = await this.userService.generateJWT(user);
        const { email, username, bio, image } = user;
        const _user = { email, token, username, bio, image };

        return {user: _user};
    }

}
