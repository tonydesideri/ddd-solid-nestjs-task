import { IBaseRepository } from 'src/core/repositories/base-repository.contract';
import { PaginationParams } from 'src/core/repositories/pagination-params.contract';
import { Task } from 'src/domain/enterprise/task.entity';
import { TaskWithAttachment } from 'src/domain/enterprise/value-objects/task-with-attachment';

export abstract class ITasksRepository extends IBaseRepository<Task> {
  abstract findManyRencentTasksWithAttachments(page: PaginationParams): Promise<TaskWithAttachment[]>
}
