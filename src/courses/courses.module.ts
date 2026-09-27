import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService], // ⬅️ se exporta para que EnrollmentsModule lo use
})
export class CoursesModule {}