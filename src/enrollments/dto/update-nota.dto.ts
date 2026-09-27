import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateNotaDto {
  @IsNotEmpty({ message: 'La nota es obligatoria' })
  @IsNumber({}, { message: 'La nota debe ser un número' })
  @Min(0, { message: 'La nota mínima es 0' })
  @Max(100, { message: 'La nota máxima es 100' })
  nota: number;
}