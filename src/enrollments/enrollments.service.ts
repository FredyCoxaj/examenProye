import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
  private enrollments: Enrollment[] = [];

  private readonly NOTA_APROBACION = 61;

  constructor(
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
  ) {}

  create(dto: CreateEnrollmentDto): Enrollment {
    this.studentsService.findOne(dto.estudianteId);

    const curso = this.coursesService.findOne(dto.cursoId);

    const yaAsignado = this.enrollments.some(
      (e) => e.estudianteId === dto.estudianteId && e.cursoId === dto.cursoId,
    );
    if (yaAsignado) {
      throw new ConflictException(
        'El estudiante ya tiene este curso asignado',
      );
    }

    if (curso.prerequisitos.length > 0) {
      // Cursos aprobados por el estudiante
      const cursosAprobados = this.enrollments
        .filter((e) => e.estudianteId === dto.estudianteId && e.aprobado)
        .map((e) => e.cursoId);

      const cumpleTodos = curso.prerequisitos.every((pre) =>
        cursosAprobados.includes(pre),
      );

      if (!cumpleTodos) {
        throw new BadRequestException(
          'El estudiante no ha aprobado los prerrequisitos de este curso',
        );
      }
    }

    const nueva: Enrollment = {
      id: randomUUID(),
      estudianteId: dto.estudianteId,
      cursoId: dto.cursoId,
      fechaAsignacion: new Date(),
      nota: dto.nota,
      aprobado: dto.nota !== undefined ? dto.nota >= this.NOTA_APROBACION : false,
    };

    this.enrollments.push(nueva); // ⬅️ método de array
    return nueva;
  }

  findAll(): Enrollment[] {
    return this.enrollments;
  }

  findOne(id: string): Enrollment {
    const enrollment = this.enrollments.find((e) => e.id === id);
    if (!enrollment) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }
    return enrollment;
  }

  findByEstudiante(estudianteId: string): Enrollment[] {
    // Valida que el estudiante exista (lanza NotFound si no)
    this.studentsService.findOne(estudianteId);
    return this.enrollments.filter((e) => e.estudianteId === estudianteId);
  }

  findByCurso(cursoId: string): Enrollment[] {
    this.coursesService.findOne(cursoId);
    return this.enrollments.filter((e) => e.cursoId === cursoId);
  }

  findAprobados(): Enrollment[] {
    return this.enrollments.filter((e) => e.aprobado);
  }

  findReprobados(): Enrollment[] {
    return this.enrollments.filter((e) => !e.aprobado && e.nota !== undefined);
  }

  updateNota(id: string, nota: number): Enrollment {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    if (nota < 0 || nota > 100) {
      throw new BadRequestException('La nota debe estar entre 0 y 100');
    }

    this.enrollments[index].nota = nota;
    this.enrollments[index].aprobado = nota >= this.NOTA_APROBACION;
    return this.enrollments[index];
  }

  remove(id: string): { message: string; asignacion: Enrollment } {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }
    const [eliminado] = this.enrollments.splice(index, 1); // ⬅️ splice
    return {
      message: 'Asignación eliminada correctamente',
      asignacion: eliminado,
    };
  }

  getKardex(estudianteId: string) {
    const estudiante = this.studentsService.findOne(estudianteId);
    const asignaciones = this.enrollments.filter(
      (e) => e.estudianteId === estudianteId,
    );

    const cursos = asignaciones.map((a) => {
      const curso = this.coursesService.findOne(a.cursoId);
      return {
        asignacionId: a.id,
        cursoId: curso.id,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        creditos: curso.creditos,
        semestre: curso.semestre,
        nota: a.nota ?? null,
        aprobado: a.aprobado,
        fechaAsignacion: a.fechaAsignacion,
      };
    });

    const creditosAprobados = cursos
      .filter((c) => c.aprobado)
      .reduce((acc, c) => acc + c.creditos, 0);

    // Promedio general (solo de cursos con nota)
    const conNota = asignaciones.filter((a) => a.nota !== undefined);
    const promedioGeneral =
      conNota.length === 0
        ? 0
        : conNota.reduce((acc, a) => acc + (a.nota as number), 0) /
          conNota.length;

    return {
      estudiante: {
        id: estudiante.id,
        carnet: estudiante.carnet,
        nombreCompleto: `${estudiante.nombre} ${estudiante.apellido}`,
        sexo: estudiante.sexo,
        fechaNacimiento: estudiante.fechaNacimiento,
      },
      cursosAsignados: cursos,
      resumen: {
        totalCursos: cursos.length,
        cursosAprobados: cursos.filter((c) => c.aprobado).length,
        cursosReprobados: cursos.filter(
          (c) => !c.aprobado && c.nota !== null,
        ).length,
        cursosPendientes: cursos.filter((c) => c.nota === null).length,
        creditosAprobados,
        promedioGeneral: Number(promedioGeneral.toFixed(2)),
      },
    };
  }

  getEstudiantesPorCurso(cursoId: string) {
    const curso = this.coursesService.findOne(cursoId);
    const asignaciones = this.enrollments.filter(
      (e) => e.cursoId === cursoId,
    );

    const estudiantes = asignaciones.map((a) => {
      const est = this.studentsService.findOne(a.estudianteId);
      return {
        asignacionId: a.id,
        estudianteId: est.id,
        carnet: est.carnet,
        nombreCompleto: `${est.nombre} ${est.apellido}`,
        nota: a.nota ?? null,
        aprobado: a.aprobado,
      };
    });

    return {
      curso: {
        id: curso.id,
        nombre: curso.nombre,
        semestre: curso.semestre,
        creditos: curso.creditos,
      },
      estudiantes,
      totalInscritos: estudiantes.length,
    };
  }

   getEstadisticas() {
    const total = this.enrollments.length;
    const aprobados = this.enrollments.filter((e) => e.aprobado).length;
    const conNota = this.enrollments.filter((e) => e.nota !== undefined);

    const promedioGlobal =
      conNota.length === 0
        ? 0
        : conNota.reduce((acc, e) => acc + (e.nota as number), 0) /
          conNota.length;

    return {
      totalAsignaciones: total,
      aprobados,
      reprobados: conNota.length - aprobados,
      pendientes: total - conNota.length,
      tasaAprobacion:
        total === 0 ? 0 : Number(((aprobados / total) * 100).toFixed(2)),
      promedioGlobal: Number(promedioGlobal.toFixed(2)),
    };
  }
}