import { IBaseRepository } from 'src/core/contracts/base-repository.contract';

export class InMemoryRepositoryImpl<T> extends IBaseRepository<T> {
  public readonly items: T[];

  constructor() {
    super();
    this.items = [];
  }

  async create(data: T): Promise<void> {
    this.items.push(data);
  }

  async findAll(): Promise<T[]> {
    return this.items;
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
