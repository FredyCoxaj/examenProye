import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    StudentsModule, // Módulo de estudiantes
    CoursesModule, // Módulo de cursos
    EnrollmentsModule, // Módulo de asignaciones (depende de los dos anteriores)
  ],
})
export class AppModule {}