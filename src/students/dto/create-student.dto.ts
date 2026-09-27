import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Sexo } from '../entities/student.entity';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  apellido: string;

  @IsDateString(
    {},
    { message: 'La fecha debe tener formato válido YYYY-MM-DD' },
  )
  fechaNacimiento: string;

  @IsEnum(Sexo, { message: 'El sexo debe ser M (Masculino) o F (Femenino)' })
  sexo: Sexo;

  @IsString()
  @IsNotEmpty({ message: 'El carnet es obligatorio' })
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{5,10}$/, {
    message: 'El carnet debe tener formato UMG (ej: 2024-01-12345)',
  })
  carnet: string;
}