import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.enrollmentsService.getEstadisticas();
  }
  @Get('aprobados')
  findAprobados() {
    return this.enrollmentsService.findAprobados();
  }

  @Get('reprobados')
  findReprobados() {
    return this.enrollmentsService.findReprobados();
  }

  @Get('estudiante/:id')
  findByEstudiante(@Param('id') id: string) {
    return this.enrollmentsService.findByEstudiante(id);
  }

  @Get('estudiante/:id/kardex')
  getKardex(@Param('id') id: string) {
    return this.enrollmentsService.getKardex(id);
  }

  @Get('curso/:id')
  findByCurso(@Param('id') id: string) {
    return this.enrollmentsService.findByCurso(id);
  }

  @Get('curso/:id/estudiantes')
  getEstudiantesPorCurso(@Param('id') id: string) {
    return this.enrollmentsService.getEstudiantesPorCurso(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id/nota')
  updateNota(@Param('id') id: string, @Body() dto: UpdateNotaDto) {
    return this.enrollmentsService.updateNota(id, dto.nota);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}