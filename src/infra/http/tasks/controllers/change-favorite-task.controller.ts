import { BadRequestException, Controller, HttpCode, NotFoundException, Param, Patch } from '@nestjs/common';
import { ResourceNotFoundError } from 'src/domain/application/use-cases/errors/resource-not-found-error';
import { ChangeFavoriteTaskUseCase } from 'src/domain/application/use-cases/change-favorite-task.use-case';


@Controller('/tasks/:id')
export class ChangeFavoriteTaskController {
  constructor(private changeFavoriteTaskUseCase: ChangeFavoriteTaskUseCase) { }

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') taskId: string) {
    const result = await this.changeFavoriteTaskUseCase.execute({
      taskId
    });

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
