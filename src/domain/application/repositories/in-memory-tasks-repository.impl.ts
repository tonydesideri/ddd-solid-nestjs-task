import { InMemoryRepositoryImpl } from 'src/core/test/repositories/in-memory-repository.impl';
import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from './tasks-repository.contract';

export class InMemoryTasksRepositoryImpl
  extends InMemoryRepositoryImpl<Task>
  implements ITasksRepository {}
