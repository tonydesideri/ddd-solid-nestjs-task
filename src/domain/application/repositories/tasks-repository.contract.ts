import { IBaseRepository } from 'src/core/repositories/base-repository.contract';
import { PaginationParams } from 'src/core/repositories/pagination-params.contract';
import { Task } from 'src/domain/enterprise/task.entity';
import { TaskLessDetails } from 'src/domain/enterprise/value-objects/task-less-details';
import { TaskWithAttachment } from 'src/domain/enterprise/value-objects/task-with-attachment';
import { TaskWithDetails } from 'src/domain/enterprise/value-objects/task-with-details';

export abstract class ITasksRepository extends IBaseRepository<Task> {
  abstract findManyRencentTasksWithAttachments(page: PaginationParams): Promise<TaskWithAttachment[]>
  abstract findManyTasksLessDetails(): Promise<TaskLessDetails[]>
  abstract findByTaskIdWithDetails(taskId: string): Promise<TaskWithDetails>
}
