import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { CreateTaskUseCase } from 'src/domain/application/use-cases/create-task.use-case';

@Controller('tasks')
export class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) { }

  @Post()
  async handle(@Body() body: CreateTaskDto) {
    const { title, description } = body;

    const result = await this.createTaskUseCase.execute({
      title,
      description,
      attachmentsIds: [],
    });

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
