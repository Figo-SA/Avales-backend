/*
  Warnings:

  - You are about to drop the column `eventoEdicionId` on the `ColeccionAval` table. All the data in the column will be lost.
  - You are about to drop the `EventoEdicion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `Evento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventoId` to the `ColeccionAval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ColeccionAval" DROP CONSTRAINT "ColeccionAval_eventoEdicionId_fkey";

-- DropForeignKey
ALTER TABLE "EventoEdicion" DROP CONSTRAINT "EventoEdicion_eventoId_fkey";

-- AlterTable
ALTER TABLE "ColeccionAval" DROP COLUMN "eventoEdicionId",
ADD COLUMN     "eventoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EventoEdicion";

-- CreateIndex
CREATE UNIQUE INDEX "Evento_codigo_key" ON "Evento"("codigo");

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
