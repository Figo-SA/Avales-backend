// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Categorías
  await prisma.categoria.createMany({
    data: [
      { id: 1, nombre: 'Infantil' },
      { id: 2, nombre: 'Juvenil' },
      { id: 3, nombre: 'Adulto' },
      { id: 4, nombre: 'Mayores' },
    ],
    skipDuplicates: true,
  });

  // Disciplinas
  await prisma.disciplina.createMany({
    data: [
      { id: 1, nombre: 'Fútbol' },
      { id: 2, nombre: 'Natación' },
      { id: 3, nombre: 'Atletismo' },
      { id: 4, nombre: 'Ciclismo' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Categorías y disciplinas insertadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
