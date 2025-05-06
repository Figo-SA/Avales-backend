/*
  Warnings:

  - Added the required column `coleccion_aval_id` to the `Dtm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coleccion_aval_id` to the `Financiero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coleccion_aval_id` to the `Pda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coleccion_aval_id` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ColeccionAval" ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Dtm" ADD COLUMN     "coleccion_aval_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Financiero" ADD COLUMN     "coleccion_aval_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pda" ADD COLUMN     "coleccion_aval_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "coleccion_aval_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ColeccionAval_estado_idx" ON "ColeccionAval"("estado");

-- CreateIndex
CREATE INDEX "Solicitud_coleccion_aval_id_idx" ON "Solicitud"("coleccion_aval_id");

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_coleccion_aval_id_fkey" FOREIGN KEY ("coleccion_aval_id") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pda" ADD CONSTRAINT "Pda_coleccion_aval_id_fkey" FOREIGN KEY ("coleccion_aval_id") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dtm" ADD CONSTRAINT "Dtm_coleccion_aval_id_fkey" FOREIGN KEY ("coleccion_aval_id") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financiero" ADD CONSTRAINT "Financiero_coleccion_aval_id_fkey" FOREIGN KEY ("coleccion_aval_id") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
