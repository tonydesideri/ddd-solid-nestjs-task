import { Either, failure, success } from 'src/core/types/either';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ICommentsRepository } from '../repositories/comments-repository.contract';
import { Comment } from 'src/domain/enterprise/comment.entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { CommentAttachment } from 'src/domain/enterprise/comment-attachment.entity';
import { CommentAttachmentList } from 'src/domain/enterprise/comment-attachment-list.entity';

interface CreateCommentUseCaseRequest {
  taskId: string;
  content: string;
  attachmentsIds: string[];
}

type CreateCommentUseCaseResponse = Either<ResourceNotFoundError, object>;

export class CreateCommentUseCase {
  constructor(
    private taskRepository: ITasksRepository,
    private commentsRepository: ICommentsRepository,
  ) {}

  async execute({
    taskId,
    content,
    attachmentsIds,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      return failure(new ResourceNotFoundError('Tarefa não encontrada'));
    }

    const comment = Comment.instance({
      taskId: new UniqueEntityID(taskId),
      content,
    });

    const attachments = attachmentsIds.map((item) => {
      return CommentAttachment.instance({
        attachmentId: new UniqueEntityID(item),
        commentId: comment.id,
      });
    });

    comment.attachments = new CommentAttachmentList(attachments);

    await this.commentsRepository.create(comment);

    return success({});
  }
}
