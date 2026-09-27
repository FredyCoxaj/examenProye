import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  private courses: Course[] = [];

  create(dto: CreateCourseDto): Course {
    const existe = this.courses.some(
      (c) => c.nombre.toLowerCase() === dto.nombre.toLowerCase(),
    );
    if (existe) {
      throw new ConflictException(
        `Ya existe un curso con el nombre "${dto.nombre}"`,
      );
    }

    if (dto.prerequisitos && dto.prerequisitos.length > 0) {
      const noExisten = dto.prerequisitos.filter(
        (id) => !this.courses.some((c) => c.id === id),
      );
      if (noExisten.length > 0) {
        throw new BadRequestException(
          `Prerrequisitos no encontrados: ${noExisten.join(', ')}`,
        );
      }
    }

    const nuevo: Course = {
      id: randomUUID(),
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      semestre: dto.semestre,
      prerequisitos: dto.prerequisitos ?? [],
      creditos: dto.creditos,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.courses.push(nuevo); // ⬅️ método de array
    return nuevo;
  }

  findAll(): Course[] {
    return this.courses;
  }

  findOne(id: string): Course {
    const curso = this.courses.find((c) => c.id === id);
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  findBySemestre(semestre: number): Course[] {
    return this.courses.filter((c) => c.semestre === semestre);
  }

  findSinPrerequisitos(): Course[] {
    return this.courses.filter((c) => c.prerequisitos.length === 0);
  }

  findByNombre(nombre: string): Course[] {
    return this.courses.filter((c) =>
      c.nombre.toLowerCase().includes(nombre.toLowerCase()),
    );
  }

  update(id: string, dto: UpdateCourseDto): Course {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    if (dto.nombre && dto.nombre !== this.courses[index].nombre) {
      const duplicado = this.courses.some(
        (c) =>
          c.nombre.toLowerCase() === dto.nombre!.toLowerCase() && c.id !== id,
      );
      if (duplicado) {
        throw new ConflictException(
          `Ya existe otro curso con el nombre "${dto.nombre}"`,
        );
      }
    }

    if (dto.prerequisitos) {
      const noExisten = dto.prerequisitos.filter(
        (pid) => !this.courses.some((c) => c.id === pid),
      );
      if (noExisten.length > 0) {
        throw new BadRequestException(
          `Prerrequisitos no encontrados: ${noExisten.join(', ')}`,
        );
      }
    }

    this.courses[index] = {
      ...this.courses[index],
      ...dto,
      updatedAt: new Date(),
    };

    return this.courses[index];
  }

  remove(id: string): { message: string; curso: Course } {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    const [eliminado] = this.courses.splice(index, 1); // ⬅️ splice
    return {
      message: 'Curso eliminado correctamente',
      curso: eliminado,
    };
  }
  getPrerequisitos(id: string): string[] {
    const curso = this.findOne(id);
    return curso.prerequisitos;
  }

  existsById(id: string): boolean {
    return this.courses.some((c) => c.id === id);
  }

  getEstadisticas() {
    const total = this.courses.length;

    const totalCreditos = this.courses.reduce(
      (acc, c) => acc + c.creditos,
      0,
    );

    const porSemestre = this.courses.reduce((acc, c) => {
      acc[c.semestre] = (acc[c.semestre] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const sinPrerequisitos = this.courses.filter(
      (c) => c.prerequisitos.length === 0,
    ).length;

    return {
      totalCursos: total,
      totalCreditos,
      promedioCreditos:
        total === 0 ? 0 : Number((totalCreditos / total).toFixed(2)),
      cursosPorSemestre: porSemestre,
      cursosSinPrerequisitos: sinPrerequisitos,
    };
  }
}