import { PaginationParams } from 'src/core/repositories/pagination-params.contract';
import { ITaskAttachmentsRepository } from 'src/domain/application/repositories/task-attachments-repository.contract';
import { ITasksRepository } from 'src/domain/application/repositories/tasks-repository.contract';
import { Task } from 'src/domain/enterprise/task.entity';

const PERPAGE = 20;
export class InMemoryTasksRepositoryImpl implements ITasksRepository {
  public items: Task[];

  constructor(private taskAttachmentsRepository?: ITaskAttachmentsRepository) {
    this.items = [];
  }

  async save(data: Task): Promise<void> {
    const index = this.items.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      this.items[index] = data;
    }
  }

  async create(data: Task): Promise<void> {
    this.items.push(data);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Task[]> {
    const items = this.items
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * PERPAGE, page * PERPAGE);

    return items;
  }

  async findById(id: string): Promise<Task | null> {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      await this.taskAttachmentsRepository.deleteManyByTaskId(id);
    }
  }
}
