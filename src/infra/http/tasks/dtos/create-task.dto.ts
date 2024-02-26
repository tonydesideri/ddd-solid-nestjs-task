import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: "Campo titulo não pode ser vazio." })
  @IsString({ message: "Campo titulo deve ser uma string." })
  readonly title: string;

  @IsNotEmpty({ message: "Campo descrição não pode ser vazio." })
  @IsString({ message: "Campo descriçao deve ser uma string." })
  readonly description: string;

  @IsArray({ message: "Campo anexos de ver um array de strings." })
  @IsOptional()
  readonly attachmentsIds: Array<string>
}
