import { IBaseRepository } from 'src/core/repositories/base-repository.contract';
import { Task } from 'src/domain/enterprise/task.entity';

export abstract class ITasksRepository extends IBaseRepository<Task> {}
