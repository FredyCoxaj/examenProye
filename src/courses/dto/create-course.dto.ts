import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del curso es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion: string;

  @IsInt({ message: 'El semestre debe ser un número entero' })
  @Min(1, { message: 'El semestre mínimo es 1' })
  @Max(10, { message: 'El semestre máximo es 10' })
  semestre: number;

  @IsArray({ message: 'Los prerrequisitos deben ser un arreglo de IDs' })
  @IsOptional()
  @IsString({ each: true, message: 'Cada prerrequisito debe ser un ID (string)' })
  prerequisitos?: string[] = [];

  @IsInt({ message: 'Los créditos deben ser un número entero' })
  @Min(1, { message: 'El curso debe tener al menos 1 crédito' })
  @Max(20, { message: 'El curso no puede tener más de 20 créditos' })
  creditos: number;
}