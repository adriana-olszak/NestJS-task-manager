import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/get-tasks-filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;

    return task;
  }

  async updateTaskStatus(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskDto;

    const task = await this.getTaskById(id, user);

    return await this.save({ ...task, status });
  }

  async deleteTask(id, user: User): Promise<void> {
    const deleted = await this.delete({ id, userId: user.id });
    if (deleted.affected === 0) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }
    return found;
  }

  async getTasks(filterDto: FilterTaskDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const found = await query.getMany();
    if (!found.length) {
      throw new NotFoundException(
        `Task with STATUS: '${status}' or SEARCH: '${search}' not found`,
      );
    }
    return found;
  }
}
