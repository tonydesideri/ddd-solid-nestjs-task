import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Param, Put } from '@nestjs/common';
import { EditTaskUseCase } from 'src/domain/application/use-cases/edit-task.use-case';
import { EditTaskDto } from '../dtos/edit-task.dto';
import { ResourceNotFoundError } from 'src/domain/application/use-cases/errors/resource-not-found-error';


@Controller('/tasks/:id')
export class EditTaskController {
  constructor(private editTaskUseCase: EditTaskUseCase) { }

  @Put()
  @HttpCode(204)
  async handle(@Body() body: EditTaskDto, @Param('id') taskId: string) {
    const { title, description, attachmentsIds } = body;

    const result = await this.editTaskUseCase.execute({
      title,
      description,
      attachmentsIds,
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
