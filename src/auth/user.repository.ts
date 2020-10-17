import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'; // npm install bcrypt --save
import { EventListenerTypes } from "typeorm/metadata/types/EventListenerTypes";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const {username, password} = authCredentialsDto;

        const user = new User();

        user.username = username;
        user.salt = await bcrypt.genSalt(); // keep salt for sign in
        user.password = await this.hashPassword(password,user.salt);
        
        try{
            await user.save();
        }catch(error){
            if(error.code === '23505') { // duplicate username. using this way we only use 1 call to database. we used @Unique() on entity
                throw new ConflictException('username already exists!')
            }else{
                throw new InternalServerErrorException();
            }
        }
    }

    // sing in 
    async validateUser(authCrentialsDto: AuthCredentialsDto): Promise<string>{
        const {username, password} = authCrentialsDto;
        const user = await this.findOne({username: username}); // this referes to UserRepository

        if(user && await user.validatePassword(password)){ // 1-user exist && 2-valid pass
            return user.username
        }else{
            return null;
        }
    }

    // hash password with salt
    private async hashPassword(password: string, salt: string): Promise<string>{
        return await bcrypt.hash(password, salt);
    }

}