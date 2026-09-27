export class Course {
  id: string;
  nombre: string;
  descripcion: string;
  semestre: number; // 1..10
  prerequisitos: string[]; // IDs de otros cursos
  creditos: number;
  createdAt: Date;
  updatedAt: Date;
}