import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-tasks-filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {
  }

  getTasks(filterDto: FilterTaskDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  getTaskById(id: number, user: User): Promise<Task> {
    return this.tasksRepository.getTaskById(id, user);
  }

  deleteTaskById(id: number, user: User): Promise<void> {
    return this.tasksRepository.deleteTask(id, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  updateTaskStatus(id, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, updateTaskDto, user);
  }
}
