import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly to: string;
}

export default {};
