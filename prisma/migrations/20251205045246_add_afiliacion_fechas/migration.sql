-- AlterTable
ALTER TABLE "Deportista" ADD COLUMN     "afiliacionFin" TIMESTAMP(3),
ADD COLUMN     "afiliacionInicio" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Deportista_afiliacion_idx" ON "Deportista"("afiliacion");

-- CreateIndex
CREATE INDEX "Deportista_afiliacionFin_idx" ON "Deportista"("afiliacionFin");
