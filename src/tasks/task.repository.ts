import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status-enum";
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    private logger = new Logger('TaskRepository'); // use logging this way, is done by creating a variable

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task'); // alias for Task entity. we can write any sql queries with query builders. createQueryBuilder is in base Repository class

        query.where('task.userId= :userId', {userId: user.id}); // authorization

        if(status){
            query.andWhere('task.status = :status',{status}) // new es6 syntax for status. equals to {status: status}. andWhere add to where clause but where override previous where clause
        }

        if(search){
            query.andWhere('task.title LIKE :search OR description LIKE :search', {search: `%${search}%`});
        }

        try{
            return await query.getMany();
        }catch(error){
            this.logger.error(`error while retrieving ${user.username} tasks`, error.stack);
            throw new InternalServerErrorException(); // we want to throw exception and show some log
        }
    }

    // it is a custom method for our repository to create a task
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status=TaskStatus.OPEN;
        task.user = user
        await task.save();

        delete task.user; // we do not want to expose user info after task is created

        return task;
    }
}