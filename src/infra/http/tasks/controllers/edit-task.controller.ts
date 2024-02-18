import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { EditTaskUseCase } from 'src/domain/application/use-cases/edit-task.use-case';
import { EditTaskDto } from '../dtos/edit-task.dto';


@Controller('/tasks/:id')
export class EditTaskController {
  constructor(private editTaskUseCase: EditTaskUseCase) { }

  @Put()
  @HttpCode(204)
  async handle(@Body() body: EditTaskDto, @Param('id') taskId: string) {
    const { title, description } = body;

    const result = await this.editTaskUseCase.execute({
      title,
      description,
      attachmentsIds: [],
      taskId
    });

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
