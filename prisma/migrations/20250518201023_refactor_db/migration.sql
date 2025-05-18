/*
  Warnings:

  - You are about to drop the column `ciudad` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `fechaEvento` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `lugarEvento` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `nombreEvento` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the column `coleccionAvalId` on the `DeportistaAval` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `DeportistaAval` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DeportistaAval` table. All the data in the column will be lost.
  - You are about to drop the `HistorialSolicitud` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requerimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Solicitud` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `descripcion` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evento` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genero` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lugar` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avalTecnicoId` to the `DeportistaAval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `DeportistaAval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeportistaAval" DROP CONSTRAINT "DeportistaAval_coleccionAvalId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialSolicitud" DROP CONSTRAINT "HistorialSolicitud_solicitudId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialSolicitud" DROP CONSTRAINT "HistorialSolicitud_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Requerimiento" DROP CONSTRAINT "Requerimiento_solicitudId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_coleccionAvalId_fkey";

-- DropIndex
DROP INDEX "ColeccionAval_categoriaId_idx";

-- DropIndex
DROP INDEX "ColeccionAval_deleted_idx";

-- DropIndex
DROP INDEX "ColeccionAval_disciplinaId_idx";

-- DropIndex
DROP INDEX "ColeccionAval_estado_idx";

-- DropIndex
DROP INDEX "DeportistaAval_coleccionAvalId_idx";

-- AlterTable
ALTER TABLE "ColeccionAval" DROP COLUMN "ciudad",
DROP COLUMN "deleted",
DROP COLUMN "estado",
DROP COLUMN "fechaEvento",
DROP COLUMN "lugarEvento",
DROP COLUMN "nombreEvento",
ADD COLUMN     "descripcion" VARCHAR(600) NOT NULL,
ADD COLUMN     "evento" VARCHAR(255) NOT NULL,
ADD COLUMN     "genero" "Genero" NOT NULL,
ADD COLUMN     "lugar" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "DeportistaAval" DROP COLUMN "coleccionAvalId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "avalTecnicoId" INTEGER NOT NULL,
ADD COLUMN     "rol" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "HistorialSolicitud";

-- DropTable
DROP TABLE "Requerimiento";

-- DropTable
DROP TABLE "Solicitud";

-- CreateTable
CREATE TABLE "AvalTecnico" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "archivo" VARCHAR(355) NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "horaSalida" TIMESTAMP(3) NOT NULL,
    "fechaRetorno" TIMESTAMP(3) NOT NULL,
    "horaRetorno" TIMESTAMP(3) NOT NULL,
    "transporteSalida" VARCHAR(255) NOT NULL,
    "transporteRetorno" VARCHAR(255) NOT NULL,
    "oficiales" INTEGER NOT NULL,
    "atletas" INTEGER NOT NULL,
    "observaciones" VARCHAR(600),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvalTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalObjetivo" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,

    CONSTRAINT "AvalObjetivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalCriterio" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,

    CONSTRAINT "AvalCriterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalRequerimiento" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "rubro" VARCHAR(255) NOT NULL,
    "cantidadDias" INTEGER NOT NULL,
    "valorUnitario" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvalRequerimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialAvalTecnico" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialAvalTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvalTecnico_coleccionAvalId_key" ON "AvalTecnico"("coleccionAvalId");

-- CreateIndex
CREATE INDEX "AvalTecnico_coleccionAvalId_idx" ON "AvalTecnico"("coleccionAvalId");

-- CreateIndex
CREATE INDEX "AvalTecnico_fechaSalida_idx" ON "AvalTecnico"("fechaSalida");

-- CreateIndex
CREATE INDEX "AvalTecnico_fechaRetorno_idx" ON "AvalTecnico"("fechaRetorno");

-- CreateIndex
CREATE INDEX "AvalTecnico_createdAt_idx" ON "AvalTecnico"("createdAt");

-- CreateIndex
CREATE INDEX "AvalTecnico_deleted_idx" ON "AvalTecnico"("deleted");

-- CreateIndex
CREATE INDEX "AvalObjetivo_avalTecnicoId_idx" ON "AvalObjetivo"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "AvalCriterio_avalTecnicoId_idx" ON "AvalCriterio"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "AvalRequerimiento_avalTecnicoId_idx" ON "AvalRequerimiento"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_usuarioId_idx" ON "HistorialAvalTecnico"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_estado_idx" ON "HistorialAvalTecnico"("estado");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_createdAt_idx" ON "HistorialAvalTecnico"("createdAt");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_avalTecnicoId_idx" ON "HistorialAvalTecnico"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "DeportistaAval_avalTecnicoId_idx" ON "DeportistaAval"("avalTecnicoId");

-- AddForeignKey
ALTER TABLE "AvalTecnico" ADD CONSTRAINT "AvalTecnico_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalObjetivo" ADD CONSTRAINT "AvalObjetivo_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalCriterio" ADD CONSTRAINT "AvalCriterio_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalRequerimiento" ADD CONSTRAINT "AvalRequerimiento_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialAvalTecnico" ADD CONSTRAINT "HistorialAvalTecnico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialAvalTecnico" ADD CONSTRAINT "HistorialAvalTecnico_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
