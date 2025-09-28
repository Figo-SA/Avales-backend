/*
  Warnings:

  - You are about to drop the column `eventoId` on the `ColeccionAval` table. All the data in the column will be lost.
  - Added the required column `eventoEdicionId` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ColeccionAval" DROP CONSTRAINT "ColeccionAval_eventoId_fkey";

-- AlterTable
ALTER TABLE "ColeccionAval" DROP COLUMN "eventoId",
ADD COLUMN     "eventoEdicionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EventoEdicion" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "lugar" VARCHAR(255) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "pais" VARCHAR(100) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "numEntrenadoresHombres" INTEGER NOT NULL,
    "numEntrenadoresMujeres" INTEGER NOT NULL,
    "numAtletasHombres" INTEGER NOT NULL,
    "numAtletasMujeres" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventoEdicion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventoEdicion_eventoId_fechaInicio_ciudad_key" ON "EventoEdicion"("eventoId", "fechaInicio", "ciudad");

-- AddForeignKey
ALTER TABLE "EventoEdicion" ADD CONSTRAINT "EventoEdicion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_eventoEdicionId_fkey" FOREIGN KEY ("eventoEdicionId") REFERENCES "EventoEdicion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
