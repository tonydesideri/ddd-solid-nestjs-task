import { ITasksRepository } from 'src/domain/application/repositories/tasks-repository.contract';
import { Task } from 'src/domain/enterprise/task.entity';
import { InMemoryRepositoryImpl } from 'test/repositories/in-memory-repository.impl';

export class InMemoryTasksRepositoryImpl
  extends InMemoryRepositoryImpl<Task>
  implements ITasksRepository {}
