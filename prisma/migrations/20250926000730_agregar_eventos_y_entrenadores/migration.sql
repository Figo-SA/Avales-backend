/*
  Warnings:

  - You are about to drop the column `fechaRetorno` on the `AvalTecnico` table. All the data in the column will be lost.
  - You are about to drop the column `fechaSalida` on the `AvalTecnico` table. All the data in the column will be lost.
  - You are about to drop the column `horaRetorno` on the `AvalTecnico` table. All the data in the column will be lost.
  - You are about to drop the column `horaSalida` on the `AvalTecnico` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `disciplinaId` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `evento` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `genero` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `lugar` on the `ColeccionAval` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avalTecnicoId,orden]` on the table `AvalCriterio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avalTecnicoId,orden]` on the table `AvalObjetivo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avalTecnicoId,deportistaId]` on the table `DeportistaAval` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fechaHoraRetorno` to the `AvalTecnico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaHoraSalida` to the `AvalTecnico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventoId` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AvalObjetivo" DROP CONSTRAINT "AvalObjetivo_avalTecnicoId_fkey";

-- DropForeignKey
ALTER TABLE "ColeccionAval" DROP CONSTRAINT "ColeccionAval_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "ColeccionAval" DROP CONSTRAINT "ColeccionAval_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_rolId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_usuarioId_fkey";

-- DropIndex
DROP INDEX "AvalTecnico_fechaRetorno_idx";

-- DropIndex
DROP INDEX "AvalTecnico_fechaSalida_idx";

-- DropIndex
DROP INDEX "Deportista_cedula_key";

-- DropIndex
DROP INDEX "Usuario_email_key";

-- AlterTable
ALTER TABLE "AvalRequerimiento" ALTER COLUMN "cantidadDias" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "valorUnitario" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "AvalTecnico" DROP COLUMN "fechaRetorno",
DROP COLUMN "fechaSalida",
DROP COLUMN "horaRetorno",
DROP COLUMN "horaSalida",
ADD COLUMN     "fechaHoraRetorno" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaHoraSalida" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "archivo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ColeccionAval" DROP COLUMN "categoriaId",
DROP COLUMN "disciplinaId",
DROP COLUMN "evento",
DROP COLUMN "genero",
DROP COLUMN "lugar",
ADD COLUMN     "eventoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FinancieroItem" ALTER COLUMN "precioAsignado" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "PdaItem" ALTER COLUMN "presupuesto" SET DATA TYPE DECIMAL(12,2);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "tipoParticipacion" VARCHAR(100) NOT NULL,
    "tipoEvento" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "lugar" VARCHAR(255) NOT NULL,
    "genero" "Genero" NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "pais" VARCHAR(100) NOT NULL,
    "alcance" VARCHAR(100) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "numEntrenadoresHombres" INTEGER NOT NULL,
    "numEntrenadoresMujeres" INTEGER NOT NULL,
    "numAtletasHombres" INTEGER NOT NULL,
    "numAtletasMujeres" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColeccionEntrenador" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rol" VARCHAR(100) NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL,

    CONSTRAINT "ColeccionEntrenador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Evento_nombre_idx" ON "Evento"("nombre");

-- CreateIndex
CREATE INDEX "Evento_fechaInicio_idx" ON "Evento"("fechaInicio");

-- CreateIndex
CREATE INDEX "ColeccionEntrenador_usuarioId_idx" ON "ColeccionEntrenador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ColeccionEntrenador_coleccionAvalId_usuarioId_key" ON "ColeccionEntrenador"("coleccionAvalId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "AvalCriterio_avalTecnicoId_orden_key" ON "AvalCriterio"("avalTecnicoId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "AvalObjetivo_avalTecnicoId_orden_key" ON "AvalObjetivo"("avalTecnicoId", "orden");

-- CreateIndex
CREATE INDEX "AvalTecnico_fechaHoraSalida_idx" ON "AvalTecnico"("fechaHoraSalida");

-- CreateIndex
CREATE INDEX "AvalTecnico_fechaHoraRetorno_idx" ON "AvalTecnico"("fechaHoraRetorno");

-- CreateIndex
CREATE UNIQUE INDEX "DeportistaAval_avalTecnicoId_deportistaId_key" ON "DeportistaAval"("avalTecnicoId", "deportistaId");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalObjetivo" ADD CONSTRAINT "AvalObjetivo_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionEntrenador" ADD CONSTRAINT "ColeccionEntrenador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionEntrenador" ADD CONSTRAINT "ColeccionEntrenador_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
