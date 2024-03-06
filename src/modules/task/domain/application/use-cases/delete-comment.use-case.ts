import { Either, failure, success } from 'core/types/either';
import { ICommentsRepository } from '../repositories/comments-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DeleteCommentUseCaseRequest {
  commentId: string;
}

type DeleteCommentUseCaseResponse = Either<ResourceNotFoundError, object>;

export class DeleteCommentUseCase {
  constructor(private commentsRepository: ICommentsRepository) { }

  async execute({
    commentId,
  }: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return failure(new ResourceNotFoundError('Tarefa não encontrada.'));
    }

    await this.commentsRepository.delete(commentId);

    return success({});
  }
}
