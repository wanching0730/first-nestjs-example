import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from '../user/user.module';
import {UserEntity} from '../user/user.entity';
import {FollowsEntity} from './follows.entity';
import {AuthMiddleware} from '../user/auth.middleware';
import {ProfileService} from './profile.service';
import {ProfileController} from './profile.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, FollowsEntity]), UserModule],
    providers: [ProfileService],
    controllers: [ProfileController],
    exports: []
})
export class ProfileModule implements NestModule{
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({path: 'profiles/:username/follow', method: RequestMethod.ALL});
    }
}
