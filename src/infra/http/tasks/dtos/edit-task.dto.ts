import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsArray({ each: true })
  @IsOptional()
  readonly attachmentsIds: Array<string>
}
