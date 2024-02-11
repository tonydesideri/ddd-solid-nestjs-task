export abstract class IBaseRepository<T> {
  abstract create(data: T): Promise<void>;
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract delete(id: string): Promise<void>;
}
