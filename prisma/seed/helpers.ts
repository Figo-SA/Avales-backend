import { PrismaClient, Genero } from '@prisma/client';

export function std(s: string) {
  return s.normalize('NFC').trim();
}

export async function ensureDisciplina(prisma: PrismaClient, nombre: string) {
  const n = std(nombre);
  const found = await prisma.disciplina.findUnique({ where: { nombre: n } });
  if (found) return found.id;
  const created = await prisma.disciplina.create({ data: { nombre: n } });
  return created.id;
}

export async function ensureCategoria(prisma: PrismaClient, nombre: string) {
  const n = std(nombre);
  const found = await prisma.categoria.findUnique({ where: { nombre: n } });
  if (found) return found.id;
  const created = await prisma.categoria.create({ data: { nombre: n } });
  return created.id;
}

export function mapGenero(x: string): Genero {
  const t = std(x).toUpperCase();
  if (t === 'MASCULINO') return Genero.MASCULINO;
  if (t === 'FEMENINO') return Genero.FEMENINO;
  // “AMBOS” o similares
  return Genero.MASCULINO_FEMENINO;
}
