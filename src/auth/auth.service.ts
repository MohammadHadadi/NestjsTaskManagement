import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: UserRepository,
        private jwtService: JwtService // from jwtModule
        ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        await this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const username = await this.userRepository.validateUser(authCredentialDto);

        if(!username){
            throw new UnauthorizedException();
        }

        const payLoad: JwtPayload= { username };

        const accessToken = this.jwtService.sign(payLoad); // create jwt token. front-end can use the token to send it with next requests and also use payload info to enhance front-end

        return {accessToken};
    }
}
