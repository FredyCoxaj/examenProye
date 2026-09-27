import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
 
  private students: Student[] = [];

  create(dto: CreateStudentDto): Student {
    // Validación: el carnet debe ser único
    const existe = this.students.some((s) => s.carnet === dto.carnet);
    if (existe) {
      throw new ConflictException(
        `Ya existe un estudiante con el carnet ${dto.carnet}`,
      );
    }

    // Validación: fecha de nacimiento no puede ser futura
    const fecha = new Date(dto.fechaNacimiento);
    if (fecha > new Date()) {
      throw new BadRequestException(
        'La fecha de nacimiento no puede ser futura',
      );
    }

    const nuevo: Student = {
      id: randomUUID(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.students.push(nuevo); 
    return nuevo;
  }

  findAll(): Student[] {
    return this.students;
  }

  findOne(id: string): Student {
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return student;
  }

  findByCarnet(carnet: string): Student {
    const student = this.students.find((s) => s.carnet === carnet);
    if (!student) {
      throw new NotFoundException(`No existe estudiante con carnet ${carnet}`);
    }
    return student;
  }

  findBySexo(sexo: string): Student[] {
    return this.students.filter((s) => s.sexo === sexo);
  }

  findMayoresDeEdad(): Student[] {
    const hoy = new Date();
    return this.students.filter((s) => {
      const nac = new Date(s.fechaNacimiento);
      const edad = hoy.getFullYear() - nac.getFullYear();
      return edad >= 18;
    });
  }

  update(id: string, dto: UpdateStudentDto): Student {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    if (dto.carnet && dto.carnet !== this.students[index].carnet) {
      const duplicado = this.students.some(
        (s) => s.carnet === dto.carnet && s.id !== id,
      );
      if (duplicado) {
        throw new ConflictException('El carnet ya está registrado');
      }
    }

    this.students[index] = {
      ...this.students[index],
      ...dto,
      updatedAt: new Date(),
    };

    return this.students[index];
  }

  remove(id: string): { message: string; estudiante: Student } {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    const [eliminado] = this.students.splice(index, 1); // ⬅️ splice
    return {
      message: 'Estudiante eliminado correctamente',
      estudiante: eliminado,
    };
  }

  getEstadisticas() {
    const total = this.students.length;
    const hombres = this.students.filter((s) => s.sexo === 'M').length;
    const mujeres = this.students.filter((s) => s.sexo === 'F').length;

    const hoy = new Date();
    const promedioEdad =
      total === 0
        ? 0
        : this.students.reduce((acc, s) => {
            const nac = new Date(s.fechaNacimiento);
            return acc + (hoy.getFullYear() - nac.getFullYear());
          }, 0) / total;

    return {
      totalEstudiantes: total,
      hombres,
      mujeres,
      promedioEdad: Number(promedioEdad.toFixed(2)),
    };
  }

  existsById(id: string): boolean {
    return this.students.some((s) => s.id === id);
  }
}
