import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Task } from "src/tasks/task.entity";

@Entity()
@Unique(['username']) // username will be unique on database
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, {eager: true}) // second is reverse side. eager means, can we retrieve tasks from user by user.tasks or not 
    tasks: Task[]

    async validatePassword(password: string): Promise<boolean>{
        const hashedPassword = await bcrypt.hash(password, this.salt);
        return hashedPassword === this.password;
    }

}