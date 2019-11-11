import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-tasks-filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository) {
  }

  getTasks(filterDto: FilterTaskDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  getTaskById(id: number): Promise<Task> {
    return this.tasksRepository.getTaskById(id);
  }

  deleteTaskById(id: number): Promise<void> {
    return this.tasksRepository.deleteTask(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  updateTaskStatus(id, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, updateTaskDto);

  }
}
