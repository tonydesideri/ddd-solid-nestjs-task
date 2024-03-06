import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Either, failure, success } from 'core/types/either';
import { CommentAttachmentList } from 'src/modules/task/domain/enterprise/comment-attachment-list.entity';
import { CommentAttachment } from 'src/modules/task/domain/enterprise/comment-attachment.entity';
import { Comment } from 'src/modules/task/domain/enterprise/comment.entity';
import { ICommentAttachmentsRepository } from '../repositories/comment-attachments-repository.contract';
import { ICommentsRepository } from '../repositories/comments-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface EditCommentUseCaseRequest {
  commentId: string;
  content: string;
  attachmentsIds: string[];
}

type EditCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comment: Comment;
  }
>;

export class EditCommentUseCase {
  constructor(
    private commentsRepository: ICommentsRepository,
    private commentAttachmentsRepository: ICommentAttachmentsRepository,
  ) { }

  async execute({
    commentId,
    content,
    attachmentsIds,
  }: EditCommentUseCaseRequest): Promise<EditCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return failure(new ResourceNotFoundError('Comentário não encontrado.'));
    }

    const currentCommentAttachments =
      await this.commentAttachmentsRepository.findManyByCommentId(commentId);

    const commentAttachmentList = new CommentAttachmentList(
      currentCommentAttachments,
    );

    const commentAttachments = attachmentsIds.map((attachmentId) => {
      return CommentAttachment.instance({
        attachmentId: new UniqueEntityID(attachmentId),
        commentId: comment.id,
      });
    });

    commentAttachmentList.update(commentAttachments);

    comment.attachments = commentAttachmentList;
    comment.content = content;

    await this.commentsRepository.save(comment);

    return success({ comment });
  }
}
