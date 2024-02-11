import { IBaseRepository } from 'src/core/contracts/base-repository.contract';
import { Task } from 'src/domain/enterprise/task.entity';

export abstract class ITasksRepository extends IBaseRepository<Task> {}
