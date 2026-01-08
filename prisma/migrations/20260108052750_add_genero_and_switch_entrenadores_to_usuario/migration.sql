/*
  Warnings:

  - You are about to drop the column `entrenadorId` on the `ColeccionEntrenador` table. All the data in the column will be lost.
  - You are about to drop the `Entrenador` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[coleccionAvalId,usuarioId]` on the table `ColeccionEntrenador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `ColeccionEntrenador` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ColeccionEntrenador" DROP CONSTRAINT "ColeccionEntrenador_entrenadorId_fkey";

-- DropForeignKey
ALTER TABLE "Entrenador" DROP CONSTRAINT "Entrenador_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Entrenador" DROP CONSTRAINT "Entrenador_disciplinaId_fkey";

-- DropIndex
DROP INDEX "ColeccionEntrenador_coleccionAvalId_entrenadorId_key";

-- DropIndex
DROP INDEX "ColeccionEntrenador_entrenadorId_idx";

-- AlterTable
ALTER TABLE "ColeccionEntrenador" DROP COLUMN "entrenadorId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "genero" "Genero";

-- DropTable
DROP TABLE "Entrenador";

-- CreateIndex
CREATE INDEX "ColeccionEntrenador_usuarioId_idx" ON "ColeccionEntrenador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ColeccionEntrenador_coleccionAvalId_usuarioId_key" ON "ColeccionEntrenador"("coleccionAvalId", "usuarioId");

-- CreateIndex
CREATE INDEX "Usuario_genero_idx" ON "Usuario"("genero");

-- AddForeignKey
ALTER TABLE "ColeccionEntrenador" ADD CONSTRAINT "ColeccionEntrenador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
