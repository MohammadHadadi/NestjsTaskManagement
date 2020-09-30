import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status-enum";
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task'); // alias for Task entity. we can write any sql queries with query builders. createQueryBuilder is in base Repository class

        if(status){
            query.andWhere('task.status = :status',{status}) // new es6 syntax for status. equals to {status: status}. andWhere add to where clause but where override previous where clause
        }

        if(search){
            query.andWhere('task.title LIKE :search OR description LIKE :search', {search: `%${search}%`});
        }

        return await query.getMany();
    }

    // it is a custom method for our repository to create a task
    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status=TaskStatus.OPEN;
        await task.save();

        return task;
    }
}