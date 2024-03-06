import { IBaseRepository } from 'core/repositories/base-repository.contract';
import { PaginationParams } from 'core/repositories/pagination-params.contract';

const PERPAGE = 20;
export class InMemoryRepositoryImpl<T> extends IBaseRepository<T> {
  public readonly items: T[];

  constructor() {
    super();
    this.items = [];
  }

  async save(data: T): Promise<void> {
    const index = this.items.findIndex(
      (item) => (item as any).id.toString() === (data as any).id,
    );
    if (index !== -1) {
      this.items[index] = data;
    }
  }

  async create(data: T): Promise<void> {
    this.items.push(data);
  }

  async findManyRecent({ page }: PaginationParams): Promise<T[]> {
    const items = this.items
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * PERPAGE, page * PERPAGE);

    return items;
  }

  async findById(id: string): Promise<T | null> {
    return (
      this.items.find((item) => (item as any).id.toString() === id) || null
    );
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(
      (item) => (item as any).id.toString() === id,
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
