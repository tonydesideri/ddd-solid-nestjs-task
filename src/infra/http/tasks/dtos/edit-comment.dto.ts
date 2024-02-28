import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditCommentDto {
  @IsNotEmpty({ message: "Campo conteúdo não pode ser vazio." })
  @IsString({ message: "Campo conteúdo deve ser uma string." })
  readonly content: string;

  @IsArray({ message: "Campo anexos de ver um array de strings." })
  @IsOptional()
  readonly attachmentsIds: Array<string>
}
