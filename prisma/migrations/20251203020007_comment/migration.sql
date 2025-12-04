-- AlterTable
ALTER TABLE "ColeccionAval" ADD COLUMN     "comentario" VARCHAR(600),
ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'SOLICITADO';
