import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seeding...');

  // Limpiar la base de datos de ser necesario
  // await prisma.$transaction([
  //   prisma.usuarioRol.deleteMany(),
  //   prisma.usuario.deleteMany(),
  //   prisma.rol.deleteMany(),
  //   prisma.categoria.deleteMany(),
  //   prisma.disciplina.deleteMany(),
  // ]);
  console.log('🧹 Base de datos limpiada');

  // Crear categorías
  const categorias = [
    { id: 1, nombre: 'Infantil', created_at: new Date() },
    { id: 2, nombre: 'Juvenil', created_at: new Date() },
    { id: 3, nombre: 'Adulto', created_at: new Date() },
    { id: 4, nombre: 'Mayores', created_at: new Date() },
  ];
  await prisma.categoria.createMany({
    data: categorias,
    skipDuplicates: true,
  });
  console.log('📋 Categorías creadas');

  // Crear disciplinas
  const disciplinas = [
    { id: 1, nombre: 'Fútbol', created_at: new Date() },
    { id: 2, nombre: 'Natación', created_at: new Date() },
    { id: 3, nombre: 'Atletismo', created_at: new Date() },
    { id: 4, nombre: 'Ciclismo', created_at: new Date() },
  ];
  await prisma.disciplina.createMany({
    data: disciplinas,
    skipDuplicates: true,
  });
  console.log('🏅 Disciplinas creadas');

  // Crear roles
  const roles = [
    {
      id: 1,
      nombre: 'super-admin',
      descripcion:
        'Administrador con acceso completo a todas las funcionalidades.',
      created_at: new Date(),
    },
    {
      id: 2,
      nombre: 'admin',
      descripcion:
        'Administrador con permisos para gestionar usuarios y configuraciones.',
      created_at: new Date(),
    },
    {
      id: 3,
      nombre: 'secretaria',
      descripcion:
        'Encargada de tareas administrativas y gestión de registros.',
      created_at: new Date(),
    },
    {
      id: 4,
      nombre: 'dtm',
      descripcion: 'Director técnico o manager de equipos.',
      created_at: new Date(),
    },
    {
      id: 5,
      nombre: 'pda',
      descripcion:
        'Personal de apoyo en actividades deportivas o administrativas.',
      created_at: new Date(),
    },
    {
      id: 6,
      nombre: 'financiero',
      descripcion: 'Encargado de la gestión financiera y presupuestos.',
      created_at: new Date(),
    },
    {
      id: 7,
      nombre: 'entrenador',
      descripcion: 'Encargado de entrenar y guiar a los atletas.',
      created_at: new Date(),
    },
  ];
  await prisma.rol.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('👑 Roles creados');

  // Crear usuarios con roles asociados
  const hashedPassword = await bcrypt.hash('123456', 10);
  const usuarios = [
    {
      id: 1,
      nombre: 'Super',
      apellido: 'Admin',
      email: 'superadmin@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567890',
      categoria_id: 1,
      disciplina_id: 1,
      rol_id: 1, // super-admin
    },
    {
      id: 2,
      nombre: 'Admin',
      apellido: 'Principal',
      email: 'admin@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567891',
      categoria_id: 1,
      disciplina_id: 1,
      rol_id: 2, // admin
    },
    {
      id: 3,
      nombre: 'Ana',
      apellido: 'Gómez',
      email: 'secretaria@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567892',
      categoria_id: 2,
      disciplina_id: 2,
      rol_id: 3, // secretaria
    },
    {
      id: 4,
      nombre: 'Carlos',
      apellido: 'López',
      email: 'dtm@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567893',
      categoria_id: 3,
      disciplina_id: 3,
      rol_id: 4, // dtm
    },
    {
      id: 5,
      nombre: 'María',
      apellido: 'Pérez',
      email: 'pda@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567894',
      categoria_id: 4,
      disciplina_id: 4,
      rol_id: 5, // pda
    },
    {
      id: 6,
      nombre: 'Juan',
      apellido: 'Martínez',
      email: 'financiero@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567895',
      categoria_id: 1,
      disciplina_id: 1,
      rol_id: 6, // financiero
    },
    {
      id: 7,
      nombre: 'Luis',
      apellido: 'Rodríguez',
      email: 'entrenador@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567896',
      categoria_id: 2,
      disciplina_id: 2,
      rol_id: 7, // entrenador
    },
    // Usuarios adicionales para pruebas
    {
      id: 8,
      nombre: 'Sofía',
      apellido: 'Hernández',
      email: 'entrenador2@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567897',
      categoria_id: 3,
      disciplina_id: 3,
      rol_id: 7, // entrenador
    },
    {
      id: 9,
      nombre: 'Diego',
      apellido: 'García',
      email: 'pda2@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567898',
      categoria_id: 4,
      disciplina_id: 4,
      rol_id: 5, // pda
    },
    {
      id: 10,
      nombre: 'Laura',
      apellido: 'Ramírez',
      email: 'secretaria2@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567899',
      categoria_id: 1,
      disciplina_id: 1,
      rol_id: 3, // secretaria
    },
  ];

  // Crear usuarios y relaciones en una transacción
  await prisma.$transaction(async (tx) => {
    // Crear usuarios
    await tx.usuario.createMany({
      data: usuarios.map(({ rol_id, ...user }) => user),
      skipDuplicates: true,
    });

    // Crear relaciones en UsuarioRol
    await tx.usuarioRol.createMany({
      data: usuarios.map((user) => ({
        usuario_id: user.id,
        rol_id: user.rol_id,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      skipDuplicates: true,
    });
  });
  console.log('👤 Usuarios creados con roles asignados');

  console.log('✅ Seeding completado');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
