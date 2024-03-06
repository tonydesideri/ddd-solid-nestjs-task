import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateTaskUseCase } from 'src/modules/task/domain/application/use-cases/create-task.use-case';
import { CreateTaskDto } from '../dtos/create-task.dto';

@Controller('tasks')
export class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) { }

  @Post()
  async handle(@Body() body: CreateTaskDto) {
    const { title, description, attachmentsIds } = body;

    const result = await this.createTaskUseCase.execute({
      title,
      description,
      attachmentsIds: attachmentsIds,
    });

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
