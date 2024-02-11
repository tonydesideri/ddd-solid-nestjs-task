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

  async findAll(filter?: Partial<TEntity>): Promise<TEntity[]> {
    let filtered = this.items;
    for (const key in filter) {
      filtered = filtered.filter((item) => item[key] === filter[key]);
    }
    return filtered;
  }

  async findOne(filter: Partial<TEntity>): Promise<TEntity> {
    return this.findAll(filter).then((items) =>
      items.length > 0 ? items[0] : null,
    );
  }

  // private getIndexById(id: UniqueEntityID) {
  //   return this.items.findIndex((item) => item.id === id);
  // }
}
