import { PrismaClient } from '@prisma/client';
import { PasswordService } from '../src/common/services/password/password.service';

const prisma = new PrismaClient();
const passwordService = new PasswordService();

async function main() {
  console.log('🚀 Iniciando seeding...');

  // Limpiar la base de datos
  await prisma.$transaction([
    prisma.usuarioRol.deleteMany(),
    prisma.usuario.deleteMany(),
    prisma.rol.deleteMany(),
    prisma.categoria.deleteMany(),
    prisma.disciplina.deleteMany(),
  ]);

  // Resetear las secuencias de los autoincrementadores (una por una)
  // await prisma.$executeRaw`ALTER SEQUENCE "UsuarioRolId_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Usuario_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "RolId_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "CategoriaId_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "DisciplinaId_seq" RESTART WITH 1;`;
  console.log('🧹 Base de datos limpiada y autoincrementadores reseteados');

  // Crear categorías
  const categorias = [
    { nombre: 'Infantil', created_at: new Date() },
    { nombre: 'Juvenil', created_at: new Date() },
    { nombre: 'Adulto', created_at: new Date() },
    { nombre: 'Mayores', created_at: new Date() },
  ];
  await prisma.categoria.createMany({
    data: categorias,
    skipDuplicates: true,
  });
  console.log('📋 Categorías creadas');

  // Crear disciplinas
  const disciplinas = [
    { nombre: 'Fútbol', created_at: new Date() },
    { nombre: 'Natación', created_at: new Date() },
    { nombre: 'Atletismo', created_at: new Date() },
    { nombre: 'Ciclismo', created_at: new Date() },
  ];
  await prisma.disciplina.createMany({
    data: disciplinas,
    skipDuplicates: true,
  });
  console.log('🏅 Disciplinas creadas');

  // Crear roles
  const roles = [
    {
      nombre: 'super-admin',
      descripcion:
        'Administrador con acceso completo a todas las funcionalidades.',
      created_at: new Date(),
    },
    {
      nombre: 'admin',
      descripcion:
        'Administrador con permisos para gestionar usuarios y configuraciones.',
      created_at: new Date(),
    },
    {
      nombre: 'secretaria',
      descripcion:
        'Encargada de tareas administrativas y gestión de registros.',
      created_at: new Date(),
    },
    {
      nombre: 'metodologo',
      descripcion: 'Director técnico o manager de equipos.',
      created_at: new Date(),
    },
    {
      nombre: 'dtm',
      descripcion: 'Director técnico o manager de equipos.',
      created_at: new Date(),
    },
    {
      nombre: 'pda',
      descripcion:
        'Personal de apoyo en actividades deportivas o administrativas.',
      created_at: new Date(),
    },
    {
      nombre: 'financiero',
      descripcion: 'Encargado de la gestión financiera y presupuestos.',
      created_at: new Date(),
    },
    {
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
  const hashedPassword = await passwordService.hashPassword('123456');
  const usuarios = [
    {
      nombre: 'Super',
      apellido: 'Admin',
      email: 'superadmin@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567890',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 1, // super-admin
    },
    {
      nombre: 'Admin',
      apellido: 'Principal',
      email: 'admin@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567891',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 2, // admin
    },
    {
      nombre: 'Ana',
      apellido: 'Gómez',
      email: 'secretaria@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567892',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 3, // secretaria
    },
    {
      nombre: 'Carlos',
      apellido: 'López',
      email: 'dtm@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567893',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 4, // dtm
    },
    {
      nombre: 'María',
      apellido: 'Pérez',
      email: 'pda@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567894',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 5, // pda
    },
    {
      nombre: 'Juan',
      apellido: 'Martínez',
      email: 'financiero@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567895',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 6, // financiero
    },
    {
      nombre: 'Luis',
      apellido: 'Rodríguez',
      email: 'entrenador@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567896',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 7, // entrenador
    },
    {
      nombre: 'Sofía',
      apellido: 'Hernández',
      email: 'entrenador2@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567897',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 7, // entrenador
    },
    {
      nombre: 'Diego',
      apellido: 'García',
      email: 'pda2@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567898',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 5, // pda
    },
    {
      nombre: 'Laura',
      apellido: 'Ramírez',
      email: 'secretaria2@ejemplo.com',
      password: hashedPassword,
      cedula: '1234567899',
      categoriaId: 1,
      disciplinaId: 1,
      rolId: 3, // secretaria
    },
  ];

  // Crear usuarios y relaciones en una transacción
  const createdUsuarios = await prisma.$transaction(async (tx) => {
    // Crear usuarios
    const insertedUsuarios = await Promise.all(
      usuarios.map(async (user) => {
        const newUser = await tx.usuario.create({
          data: {
            email: user.email,
            password: user.password,
            nombre: user.nombre,
            apellido: user.apellido,
            cedula: user.cedula,
            categoriaId: user.categoriaId,
            disciplinaId: user.disciplinaId,
          },
        });
        return { ...user, id: newUser.id };
      }),
    );

    // Crear relaciones en UsuarioRol
    await tx.usuarioRol.createMany({
      data: insertedUsuarios.map((user) => ({
        usuarioId: user.id,
        rolId: user.rolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      skipDuplicates: true,
    });

    return insertedUsuarios;
  });

  console.log('👤 Usuarios creados con roles asignados:', createdUsuarios);

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
