import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from './tasks-repository.contract';
import { InMemoryRepositoryImpl } from 'test/repositories/in-memory-repository.impl';

export class InMemoryTasksRepositoryImpl
  extends InMemoryRepositoryImpl<Task>
  implements ITasksRepository {}
