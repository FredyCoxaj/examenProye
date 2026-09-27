import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID del estudiante es obligatorio' })
  estudianteId: string;

  @IsString()
  @IsNotEmpty({ message: 'El ID del curso es obligatorio' })
  cursoId: string;

  @IsOptional()
  @IsNumber({}, { message: 'La nota debe ser un número' })
  @Min(0, { message: 'La nota mínima es 0' })
  @Max(100, { message: 'La nota máxima es 100' })
  nota?: number;
}