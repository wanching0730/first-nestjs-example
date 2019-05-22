import { HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ProfileRO, ProfileData } from './profile.interface';
import {FollowsEntity} from "./follows.entity";
import {HttpException} from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {

}
