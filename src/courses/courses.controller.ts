import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  findAll(
    @Query('semestre') semestre?: string,
    @Query('sinPrerequisitos') sinPre?: string,
    @Query('nombre') nombre?: string,
  ) {
    if (semestre) return this.coursesService.findBySemestre(Number(semestre));
    if (sinPre === 'true') return this.coursesService.findSinPrerequisitos();
    if (nombre) return this.coursesService.findByNombre(nombre);
    return this.coursesService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.coursesService.getEstadisticas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/prerequisitos')
  getPrerequisitos(@Param('id') id: string) {
    return { prerequisitos: this.coursesService.getPrerequisitos(id) };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}