-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateIndex
CREATE INDEX "Usuario_resetPasswordToken_idx" ON "Usuario"("resetPasswordToken");
