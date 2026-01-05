/*
  Warnings:

  - You are about to drop the column `fecha` on the `HistorialColeccion` table. All the data in the column will be lost.
  - You are about to drop the `HistorialAvalTecnico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistorialDtm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistorialFinanciero` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistorialPda` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `etapa` to the `HistorialColeccion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EtapaFlujo" AS ENUM ('SOLICITUD', 'REVISION_DTM', 'PDA', 'CONTROL_PREVIO', 'SECRETARIA', 'FINANCIERO');

-- AlterEnum
ALTER TYPE "TipoRol" ADD VALUE 'CONTROL_PREVIO';

-- DropForeignKey
ALTER TABLE "HistorialAvalTecnico" DROP CONSTRAINT "HistorialAvalTecnico_avalTecnicoId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialAvalTecnico" DROP CONSTRAINT "HistorialAvalTecnico_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialDtm" DROP CONSTRAINT "HistorialDtm_dtmId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialDtm" DROP CONSTRAINT "HistorialDtm_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialFinanciero" DROP CONSTRAINT "HistorialFinanciero_financieroId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialFinanciero" DROP CONSTRAINT "HistorialFinanciero_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialPda" DROP CONSTRAINT "HistorialPda_pdaId_fkey";

-- DropForeignKey
ALTER TABLE "HistorialPda" DROP CONSTRAINT "HistorialPda_usuarioId_fkey";

-- AlterTable
ALTER TABLE "HistorialColeccion" DROP COLUMN "fecha",
ADD COLUMN     "comentario" VARCHAR(600),
ADD COLUMN     "etapa" "EtapaFlujo" NOT NULL;

-- DropTable
DROP TABLE "HistorialAvalTecnico";

-- DropTable
DROP TABLE "HistorialDtm";

-- DropTable
DROP TABLE "HistorialFinanciero";

-- DropTable
DROP TABLE "HistorialPda";

-- CreateTable
CREATE TABLE "EventoItem" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "presupuesto" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventoItem_eventoId_idx" ON "EventoItem"("eventoId");

-- CreateIndex
CREATE INDEX "EventoItem_itemId_idx" ON "EventoItem"("itemId");

-- CreateIndex
CREATE INDEX "EventoItem_mes_idx" ON "EventoItem"("mes");

-- CreateIndex
CREATE UNIQUE INDEX "EventoItem_eventoId_itemId_mes_key" ON "EventoItem"("eventoId", "itemId", "mes");

-- CreateIndex
CREATE INDEX "HistorialColeccion_etapa_idx" ON "HistorialColeccion"("etapa");

-- CreateIndex
CREATE INDEX "HistorialColeccion_coleccionAvalId_idx" ON "HistorialColeccion"("coleccionAvalId");

-- AddForeignKey
ALTER TABLE "EventoItem" ADD CONSTRAINT "EventoItem_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoItem" ADD CONSTRAINT "EventoItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
