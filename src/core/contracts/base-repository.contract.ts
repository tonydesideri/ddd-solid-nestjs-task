export abstract class IBaseRepository<T> {
  abstract create(data: T): Promise<void>;
  abstract findAll(filter?: Partial<T>): Promise<T[]>;
  abstract findOne(filter: Partial<T>): Promise<T | null>;
}
