import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import {CreateUserDto, LoginUserDto, UpdateUserDto} from './dto';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

const jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    // login
    async findOne(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const findOneOptions = {
            email: loginUserDto.email,
            password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
        };

        return await this.userRepository.findOne(findOneOptions);
    }

    // async findHello(email: string): Promise<string> {
    //     return await "hello";
    // }

    async findById(id: number): Promise<UserRO> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            const errors = {User: ' not found'};
            throw new HttpException({errors}, 401);
        }

        return this.buildUserRO(user);
    }

    async findByEmail(email: string): Promise<UserRO>{
        const user = await this.userRepository.findOne({email: email}, {
            relations: ['favorites']
        });

        if (!user) {
            const errors = {User: ' not found'};
            throw new HttpException({errors}, 401);
        }

        return this.buildUserRO(user);
    }

    async create(createUserDto: CreateUserDto): Promise<UserRO> {

        // check uniqueness of username and password
        const { username, email, password } = createUserDto;
        const qb = await getRepository(UserEntity).createQueryBuilder('user')
            .where('user.username = :username', { username })
            .orWhere('user.email = :email', { email});

        const duplicateUser = await qb.getOne();

        if(duplicateUser) {
            const errors = {username: 'Username and email must be unique'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        // create new user
        let newUser = new UserEntity();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        newUser.articles = [];

        const errors = await validate(newUser);
        if(errors.length > 0) {
            const validation_errors = {username: 'User input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', validation_errors}, HttpStatus.BAD_REQUEST);
        } else {
            const createdUser = await this.userRepository.save(newUser);
            return this.buildUserRO(createdUser);
        }
    }

    async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        let user = await this.userRepository.findOne(userId);
        delete user.password;
        delete user.favorites;

        let updatedUser = Object.assign(user, updateUserDto);
        return await this.userRepository.save(updatedUser);
    }

    async delete(email: string): Promise<DeleteResult> {
        return await this.userRepository.delete({email: email});
    }

    public generateJWT (user) {
        let today = new Date();
        let exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        return jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            exp: exp.getTime() / 1000,
        }, process.env.SECRET);
    };

    private buildUserRO(user: UserEntity): UserRO {
        const userRO = {
            username: user.username,
            email: user.email,
            bio: user.bio,
            token: this.generateJWT(user),
            image: user.image,
            favorites: user.favorites
        };

        return {user: userRO};
    }
}

