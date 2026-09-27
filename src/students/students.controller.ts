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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  findAll(@Query('sexo') sexo?: string, @Query('mayores') mayores?: string) {
    if (sexo) return this.studentsService.findBySexo(sexo);
    if (mayores === 'true') return this.studentsService.findMayoresDeEdad();
    return this.studentsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.studentsService.getEstadisticas();
  }

  @Get('carnet/:carnet')
  findByCarnet(@Param('carnet') carnet: string) {
    return this.studentsService.findByCarnet(carnet);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}