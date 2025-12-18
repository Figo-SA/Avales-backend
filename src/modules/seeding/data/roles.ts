export enum TipoRol {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SECRETARIA = 'SECRETARIA',
  DTM = 'DTM',
  DTM_EIDE = 'DTM_EIDE',
  ENTRENADOR = 'ENTRENADOR',
  USUARIO = 'USUARIO',
  DEPORTISTA = 'DEPORTISTA',
  PDA = 'PDA',
  FINANCIERO = 'FINANCIERO',
}

export const rolesSeed = [
  {
    nombre: TipoRol.SUPER_ADMIN,
    descripcion: 'Administrador con acceso completo a todas las funcionalidades.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.ADMIN,
    descripcion: 'Administrador con permisos para gestionar usuarios y configuraciones.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.SECRETARIA,
    descripcion: 'Encargada de tareas administrativas y gestión de registros.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.DTM_EIDE,
    descripcion: 'Director técnico o manager de equipos.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.DTM,
    descripcion: 'Director técnico o manager de equipos.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.PDA,
    descripcion: 'Personal de apoyo en actividades deportivas o administrativas.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.FINANCIERO,
    descripcion: 'Encargado de la gestión financiera y presupuestos.',
    createdAt: new Date(),
  },
  {
    nombre: TipoRol.ENTRENADOR,
    descripcion: 'Encargado de entrenar y guiar a los atletas.',
    createdAt: new Date(),
  },
];
