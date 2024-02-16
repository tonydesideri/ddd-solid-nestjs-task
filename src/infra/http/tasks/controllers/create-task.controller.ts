import { Body, Controller, Post } from "@nestjs/common";
import { CreateTaskDto } from "../dtos/create-task.dto";

@Controller('tasks')
export class AuthController {

  @Post()
  async handle(@Body() body: CreateTaskDto) {
    return await true
  }
}