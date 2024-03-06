import { IBaseRepository } from 'core/repositories/base-repository.contract';
import { PaginationParams } from 'core/repositories/pagination-params.contract';
import { Task } from 'src/modules/task/domain/enterprise/task.entity';
import { TaskLessDetails } from 'src/modules/task/domain/enterprise/value-objects/task-less-details';
import { TaskWithAttachment } from 'src/modules/task/domain/enterprise/value-objects/task-with-attachment';
import { TaskWithDetails } from 'src/modules/task/domain/enterprise/value-objects/task-with-details';

export abstract class ITasksRepository extends IBaseRepository<Task> {
  abstract findManyRencentTasksWithAttachments(page: PaginationParams): Promise<TaskWithAttachment[]>
  abstract findManyTasksLessDetails(): Promise<TaskLessDetails[]>
  abstract findByTaskIdWithDetails(taskId: string): Promise<TaskWithDetails>
}
