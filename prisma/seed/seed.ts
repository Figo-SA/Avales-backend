import { PrismaClient } from '@prisma/client';
import { CATEGORIAS, DISCIPLINAS, ROLES, USUARIOS, EVENTOS } from './datos';
import { std, mapGenero, ensureCategoria, ensureDisciplina } from './helpers';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedCatalogos() {
  // seed categorías
  await prisma.categoria.createMany({
    data: CATEGORIAS.map((nombre) => ({ nombre: std(nombre) })),
    skipDuplicates: true,
  });
  // seed disciplinas
  await prisma.disciplina.createMany({
    data: DISCIPLINAS.map((nombre) => ({ nombre: std(nombre) })),
    skipDuplicates: true,
  });
  // seed roles
  await prisma.rol.createMany({
    data: ROLES.map((r) => ({
      nombre: r.nombre as any,
      descripcion: r.descripcion,
    })),
    skipDuplicates: true,
  });
  console.log('✅ Catálogos listos');
}

async function seedUsuarios() {
  const hashed = await bcrypt.hash('123456', 10);
  for (const u of USUARIOS) {
    // upsert por email/cedula únicos
    const user = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: hashed,
        nombre: u.nombre,
        apellido: u.apellido,
        cedula: u.cedula,
        // Por simpleza: primera categoría y disciplina existentes
        categoria: { connect: { id: 1 } },
        disciplina: { connect: { id: 1 } },
      },
    });

    const rol = await prisma.rol.findFirst({ where: { nombre: u.rol as any } });
    if (rol) {
      await prisma.usuarioRol.upsert({
        where: { usuarioId_rolId: { usuarioId: user.id, rolId: rol.id } },
        update: {},
        create: { usuarioId: user.id, rolId: rol.id },
      });
    }
  }
  console.log('✅ Usuarios con roles listos');
}

/**
 * Eventos SIN ediciones
 * Requiere: `codigo` @unique en el modelo Evento para usar upsert.
 */
async function seedEventos() {
  for (const e of EVENTOS) {
    const disciplinaId = await ensureDisciplina(prisma, e.disciplinaNombre);
    const categoriaId = await ensureCategoria(prisma, e.categoriaNombre);

    const lugar = e.lugar ?? 'Por definir';
    const provincia = e.provincia ?? 'Por definir';
    const ciudad = e.ciudad ?? 'Por definir';
    const pais = (e.pais ?? 'ECUADOR').toString();
    const fechaInicio = e.fechaInicio ? new Date(e.fechaInicio) : new Date();
    const fechaFin = e.fechaFin ? new Date(e.fechaFin) : fechaInicio;

    await prisma.evento.upsert({
      where: { codigo: e.codigo }, // requiere @unique
      update: {
        tipoParticipacion: std(e.tipoParticipacion),
        tipoEvento: std(e.tipoEvento),
        nombre: std(e.nombre),
        lugar: std(lugar),
        genero: mapGenero(e.genero),
        disciplinaId,
        categoriaId,
        provincia: std(provincia),
        ciudad: std(ciudad),
        pais: std(pais).toUpperCase(),
        alcance: std(e.alcance),
        fechaInicio,
        fechaFin,
        numEntrenadoresHombres: e.numEntrenadoresHombres ?? 0,
        numEntrenadoresMujeres: e.numEntrenadoresMujeres ?? 0,
        numAtletasHombres: e.numAtletasHombres ?? 0,
        numAtletasMujeres: e.numAtletasMujeres ?? 0,
      },
      create: {
        codigo: e.codigo,
        tipoParticipacion: std(e.tipoParticipacion),
        tipoEvento: std(e.tipoEvento),
        nombre: std(e.nombre),
        lugar: std(lugar),
        genero: mapGenero(e.genero),
        disciplinaId,
        categoriaId,
        provincia: std(provincia),
        ciudad: std(ciudad),
        pais: std(pais).toUpperCase(),
        alcance: std(e.alcance),
        fechaInicio,
        fechaFin,
        numEntrenadoresHombres: e.numEntrenadoresHombres ?? 0,
        numEntrenadoresMujeres: e.numEntrenadoresMujeres ?? 0,
        numAtletasHombres: e.numAtletasHombres ?? 0,
        numAtletasMujeres: e.numAtletasMujeres ?? 0,
      },
    });
  }

  console.log('✅ Eventos listos (sin ediciones)');
}

async function main() {
  console.log('🚀 Iniciando seeding...');
  // Protección opcional:
  if (process.env.NODE_ENV === 'production') {
    console.warn('⛔ Seeding deshabilitado en NODE_ENV=production');
    // return; // descomenta si quieres bloquear en prod
  }

  await seedCatalogos();
  await seedUsuarios();
  await seedEventos();

  console.log('🎉 Seeding completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
