import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { title } from 'process';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { pipe } from 'rxjs';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard()) // Authorization means if a user can access a resource or not. checking the sent user in request is a great way to do it (Our controller is in complete without it) 
export class TasksController {

    private logger= new Logger('TaskController');

    constructor(private tasksService: TasksService){
    }

    @Get()
    //@UsePipes(ValidationPipe) // instead of using as @Query param, could use this
    async getTasks(
        @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]>{ // using query string and dto
        this.logger.verbose(`getting all tasks for ${user.username} with ${JSON.stringify(getTasksFilterDto)} filter`)
        return await this.tasksService.getTasks(getTasksFilterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task>{
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe) // validate dto object- class-validator is used. Validationpipe can be used as input param of @Body()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> // using dto as best practice to tranfer data
    {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void>{
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status',TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task>{ // custom validation on status parameter
        return this.tasksService.updateTaskStatus(id, status, user);
    }
 }







// createTask(@Body('title') title: string, @Body('description' description){} // a way to get params without dto- not a good practice
