import { Either, failure, success } from 'src/core/types/either';
import { ICommentsRepository } from '../repositories/comments-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DeleteCommentUseCaseRequest {
  id: string;
}

type DeleteCommentUseCaseResponse = Either<ResourceNotFoundError, object>;

export class DeleteCommentUseCase {
  constructor(private commentsRepository: ICommentsRepository) { }

  async execute({
    id,
  }: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {

      return failure(new ResourceNotFoundError('Tarefa não encontrada.'));
    }

    await this.commentsRepository.delete(id);

    return success({});
  }
}
