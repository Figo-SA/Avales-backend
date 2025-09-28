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
  // Crear usuarios y asignar rol en una transacción
  // await prisma.$transaction(async (tx) => {
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
  // });
  console.log('✅ Usuarios con roles listos');
}

async function seedEventosYEdiciones() {
  for (const e of EVENTOS) {
    const disciplinaId = await ensureDisciplina(prisma, e.disciplinaNombre);
    const categoriaId = await ensureCategoria(prisma, e.categoriaNombre);

    // Evento: si puedes, agrega @unique en "codigo" en tu schema para usar upsert directo.
    let evento = await prisma.evento.findFirst({ where: { codigo: e.codigo } });
    if (!evento) {
      evento = await prisma.evento.create({
        data: {
          codigo: e.codigo,
          tipoParticipacion: std(e.tipoParticipacion),
          tipoEvento: std(e.tipoEvento),
          nombre: std(e.nombre),
          lugar: e.ediciones?.[0]?.lugar
            ? std(e.ediciones[0].lugar)
            : 'Por definir',
          genero: mapGenero(e.genero),
          disciplinaId,
          categoriaId,
          provincia: e.ediciones?.[0]?.provincia
            ? std(e.ediciones[0].provincia)
            : 'Por definir',
          ciudad: e.ediciones?.[0]?.ciudad
            ? std(e.ediciones[0].ciudad)
            : 'Por definir',
          pais: e.ediciones?.[0]?.pais
            ? std(e.ediciones[0].pais).toUpperCase()
            : 'ECUADOR',
          alcance: std(e.alcance),
          fechaInicio: e.ediciones?.[0]?.fechaInicio
            ? new Date(e.ediciones[0].fechaInicio)
            : new Date(),
          fechaFin: e.ediciones?.[0]?.fechaFin
            ? new Date(e.ediciones[0].fechaFin)
            : new Date(),
          numEntrenadoresHombres: e.ediciones?.[0]?.numEH ?? 0,
          numEntrenadoresMujeres: e.ediciones?.[0]?.numEM ?? 0,
          numAtletasHombres: e.ediciones?.[0]?.numAH ?? 0,
          numAtletasMujeres: e.ediciones?.[0]?.numAM ?? 0,
        },
      });
    }

    for (const ed of e.ediciones ?? []) {
      await prisma.eventoEdicion.upsert({
        where: {
          // nombre de where generado por @@unique([eventoId, fechaInicio, ciudad])
          eventoId_fechaInicio_ciudad: {
            eventoId: evento.id,
            fechaInicio: new Date(ed.fechaInicio),
            ciudad: std(ed.ciudad),
          },
        },
        update: {
          fechaFin: new Date(ed.fechaFin),
          lugar: std(ed.lugar),
          provincia: std(ed.provincia),
          pais: std(ed.pais).toUpperCase(),
          numEntrenadoresHombres: ed.numEH,
          numEntrenadoresMujeres: ed.numEM,
          numAtletasHombres: ed.numAH,
          numAtletasMujeres: ed.numAM,
        },
        create: {
          eventoId: evento.id,
          lugar: std(ed.lugar),
          provincia: std(ed.provincia),
          ciudad: std(ed.ciudad),
          pais: std(ed.pais).toUpperCase(),
          fechaInicio: new Date(ed.fechaInicio),
          fechaFin: new Date(ed.fechaFin),
          numEntrenadoresHombres: ed.numEH,
          numEntrenadoresMujeres: ed.numEM,
          numAtletasHombres: ed.numAH,
          numAtletasMujeres: ed.numAM,
        },
      });
    }
  }

  console.log('✅ Eventos y ediciones listos');
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
  await seedEventosYEdiciones();

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
