import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsArray()
  @IsOptional()
  readonly attachmentsIds: Array<string>
}
