import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { title } from 'process';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { pipe } from 'rxjs';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';


@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService){
    }

    @Get()
    //@UsePipes(ValidationPipe) // instead of using as @Query param, could use this
    async getTasks(@Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto): Promise<Task[]>{ // using query string and dto
        return await this.tasksService.getTasks(getTasksFilterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task>{
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe) // validate dto object- class-validator is used. Validationpipe can be used as input param of @Body()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> // using dto as best practice to tranfer data
    {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status',TaskStatusValidationPipe) status: TaskStatus): Promise<Task>{ // custom validation on status parameter
        return this.tasksService.updateTaskStatus(id, status);
    }
}







// createTask(@Body('title') title: string, @Body('description' description){} // a way to get params without dto- not a good practice
