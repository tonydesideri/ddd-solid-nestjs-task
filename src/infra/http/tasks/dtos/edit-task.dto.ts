import { IsArray, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsOptional()
  @IsString({ message: "Campo titulo deve ser uma string." })
  readonly title: string;

  @IsOptional()
  @IsString({ message: "Campo descriçao deve ser uma string." })
  readonly description: string;

  @IsArray({ message: "Campo anexos de ver um array de strings." })
  @IsOptional()
  readonly attachmentsIds: Array<string>
}
