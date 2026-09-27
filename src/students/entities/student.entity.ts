export enum Sexo {
  MASCULINO = 'M',
  FEMENINO = 'F',
}

export class Student {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: Sexo;
  carnet: string; 
  createdAt: Date;
  updatedAt: Date;
}