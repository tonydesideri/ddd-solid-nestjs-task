export abstract class IBaseRepository<T> {
  abstract create(data: T): Promise<void>;
  abstract findAll(): Promise<T[]>;
}
