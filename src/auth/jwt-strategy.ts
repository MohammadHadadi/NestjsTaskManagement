import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config'

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserRepository) // to find user
        private userRepositoy: UserRepository
    ){
        super({ // use to authoriza user based on sent token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || jwtConfig.secret, // env variable is used first
        });
    }

    async validate(payload: JwtPayload): Promise<User>{  // automatically called if provide info in jwt token is correct using the above code

        const {username} = payload;

        const user = await this.userRepositoy.findOne( {username});

        if(!user){
            throw new UnauthorizedException();
        }

        return user; // it will be put in request and will be available to use by handlers

    }
}
