import { IBaseRepository } from 'src/core/contracts/base-repository.contract';

export class InMemoryRepositoryImpl<TEntity> extends IBaseRepository<TEntity> {
  public readonly items: TEntity[];

  constructor() {
    super();
    this.items = [];
  }

  async create(data: TEntity): Promise<void> {
    this.items.push(data);
  }

  async findAll(): Promise<TEntity[]> {
    return this.items;
  }
}
