/*
  Warnings:

  - You are about to alter the column `nombre` on the `Actividad` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `descripcion` on the `Actividad` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `nombre` on the `Categoria` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `nombre_evento` on the `ColeccionAval` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `lugar_evento` on the `ColeccionAval` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `ciudad` on the `ColeccionAval` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nombres` on the `Deportista` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `apellidos` on the `Deportista` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `cedula` on the `Deportista` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `genero` on the `Deportista` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `Disciplina` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `descripcion` on the `Dtm` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `documento` on the `Dtm` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(355)`.
  - You are about to alter the column `observacion` on the `Dtm` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `descripcion` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `cuenta_bancaria` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `fondos` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `notas` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `razon_social` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `ruc` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `direccion` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `telefono` on the `Financiero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `descripcion` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `descripcion` on the `Pda` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `documento` on the `Pda` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(355)`.
  - You are about to drop the column `tecnico_id` on the `Requerimiento` table. All the data in the column will be lost.
  - You are about to alter the column `rubro` on the `Requerimiento` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `cantidad_dias` on the `Requerimiento` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `nombre` on the `Rol` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `descripcion` on the `Rol` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `descripcion` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `archivo` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(355)`.
  - You are about to alter the column `objetivos` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `criterios` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `ruta_salida` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `transporte_salida` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `transporte_retorno` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `observaciones` on the `Solicitud` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `email` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `password` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `nombre` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `apellido` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `cedula` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `disciplina_id` to the `Deportista` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `estado` on the `HistorialColeccion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `HistorialDtm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `HistorialFinanciero` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `HistorialPda` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estado` on the `HistorialSolicitud` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `solicitud_id` to the `Requerimiento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'APROBADO', 'ACTIVO', 'RECHAZADO');

-- DropForeignKey
ALTER TABLE "Requerimiento" DROP CONSTRAINT "Requerimiento_tecnico_id_fkey";

-- AlterTable
ALTER TABLE "Actividad" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(600);

-- AlterTable
ALTER TABLE "Categoria" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "ColeccionAval" ALTER COLUMN "nombre_evento" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "lugar_evento" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "ciudad" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Deportista" ADD COLUMN     "disciplina_id" INTEGER NOT NULL,
ALTER COLUMN "nombres" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "apellidos" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "cedula" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "genero" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Disciplina" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Dtm" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "documento" SET DATA TYPE VARCHAR(355),
ALTER COLUMN "observacion" SET DATA TYPE VARCHAR(600);

-- AlterTable
ALTER TABLE "Financiero" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "cuenta_bancaria" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "fondos" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "notas" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "razon_social" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "ruc" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "HistorialColeccion" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL;

-- AlterTable
ALTER TABLE "HistorialDtm" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL;

-- AlterTable
ALTER TABLE "HistorialFinanciero" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL;

-- AlterTable
ALTER TABLE "HistorialPda" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL;

-- AlterTable
ALTER TABLE "HistorialSolicitud" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(600);

-- AlterTable
ALTER TABLE "Pda" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "documento" SET DATA TYPE VARCHAR(355);

-- AlterTable
ALTER TABLE "Requerimiento" DROP COLUMN "tecnico_id",
ADD COLUMN     "solicitud_id" INTEGER NOT NULL,
ALTER COLUMN "rubro" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "cantidad_dias" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Rol" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Solicitud" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "archivo" SET DATA TYPE VARCHAR(355),
ALTER COLUMN "objetivos" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "criterios" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "ruta_salida" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "transporte_salida" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "transporte_retorno" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "observaciones" SET DATA TYPE VARCHAR(600);

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "email" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "apellido" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "cedula" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE INDEX "Actividad_numero_idx" ON "Actividad"("numero");

-- CreateIndex
CREATE INDEX "Categoria_deleted_idx" ON "Categoria"("deleted");

-- CreateIndex
CREATE INDEX "ColeccionAval_disciplina_id_idx" ON "ColeccionAval"("disciplina_id");

-- CreateIndex
CREATE INDEX "ColeccionAval_categoria_id_idx" ON "ColeccionAval"("categoria_id");

-- CreateIndex
CREATE INDEX "ColeccionAval_deleted_idx" ON "ColeccionAval"("deleted");

-- CreateIndex
CREATE INDEX "Deportista_nombres_idx" ON "Deportista"("nombres");

-- CreateIndex
CREATE INDEX "Deportista_categoria_id_idx" ON "Deportista"("categoria_id");

-- CreateIndex
CREATE INDEX "Deportista_deleted_idx" ON "Deportista"("deleted");

-- CreateIndex
CREATE INDEX "DeportistaAval_coleccion_aval_id_idx" ON "DeportistaAval"("coleccion_aval_id");

-- CreateIndex
CREATE INDEX "DeportistaAval_deportista_id_idx" ON "DeportistaAval"("deportista_id");

-- CreateIndex
CREATE INDEX "Disciplina_deleted_idx" ON "Disciplina"("deleted");

-- CreateIndex
CREATE INDEX "Dtm_created_at_idx" ON "Dtm"("created_at");

-- CreateIndex
CREATE INDEX "Dtm_fecha_presentacion_idx" ON "Dtm"("fecha_presentacion");

-- CreateIndex
CREATE INDEX "Dtm_descripcion_idx" ON "Dtm"("descripcion");

-- CreateIndex
CREATE INDEX "Dtm_deleted_idx" ON "Dtm"("deleted");

-- CreateIndex
CREATE INDEX "Financiero_created_at_idx" ON "Financiero"("created_at");

-- CreateIndex
CREATE INDEX "Financiero_descripcion_idx" ON "Financiero"("descripcion");

-- CreateIndex
CREATE INDEX "Financiero_deleted_idx" ON "Financiero"("deleted");

-- CreateIndex
CREATE INDEX "FinancieroItem_financiero_id_idx" ON "FinancieroItem"("financiero_id");

-- CreateIndex
CREATE INDEX "FinancieroItem_item_id_idx" ON "FinancieroItem"("item_id");

-- CreateIndex
CREATE INDEX "HistorialColeccion_usuario_id_idx" ON "HistorialColeccion"("usuario_id");

-- CreateIndex
CREATE INDEX "HistorialColeccion_estado_idx" ON "HistorialColeccion"("estado");

-- CreateIndex
CREATE INDEX "HistorialColeccion_created_at_idx" ON "HistorialColeccion"("created_at");

-- CreateIndex
CREATE INDEX "HistorialDtm_usuario_id_idx" ON "HistorialDtm"("usuario_id");

-- CreateIndex
CREATE INDEX "HistorialDtm_estado_idx" ON "HistorialDtm"("estado");

-- CreateIndex
CREATE INDEX "HistorialDtm_created_at_idx" ON "HistorialDtm"("created_at");

-- CreateIndex
CREATE INDEX "HistorialDtm_dtm_id_idx" ON "HistorialDtm"("dtm_id");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_usuario_id_idx" ON "HistorialFinanciero"("usuario_id");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_estado_idx" ON "HistorialFinanciero"("estado");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_created_at_idx" ON "HistorialFinanciero"("created_at");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_financiero_id_idx" ON "HistorialFinanciero"("financiero_id");

-- CreateIndex
CREATE INDEX "HistorialPda_usuario_id_idx" ON "HistorialPda"("usuario_id");

-- CreateIndex
CREATE INDEX "HistorialPda_estado_idx" ON "HistorialPda"("estado");

-- CreateIndex
CREATE INDEX "HistorialPda_created_at_idx" ON "HistorialPda"("created_at");

-- CreateIndex
CREATE INDEX "HistorialPda_pda_id_idx" ON "HistorialPda"("pda_id");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_usuario_id_idx" ON "HistorialSolicitud"("usuario_id");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_estado_idx" ON "HistorialSolicitud"("estado");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_created_at_idx" ON "HistorialSolicitud"("created_at");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_solicitud_id_idx" ON "HistorialSolicitud"("solicitud_id");

-- CreateIndex
CREATE INDEX "Item_actividad_id_idx" ON "Item"("actividad_id");

-- CreateIndex
CREATE INDEX "Item_numero_idx" ON "Item"("numero");

-- CreateIndex
CREATE INDEX "Pda_created_at_idx" ON "Pda"("created_at");

-- CreateIndex
CREATE INDEX "Pda_deleted_idx" ON "Pda"("deleted");

-- CreateIndex
CREATE INDEX "PdaItem_pda_id_idx" ON "PdaItem"("pda_id");

-- CreateIndex
CREATE INDEX "PdaItem_item_id_idx" ON "PdaItem"("item_id");

-- CreateIndex
CREATE INDEX "Requerimiento_solicitud_id_idx" ON "Requerimiento"("solicitud_id");

-- CreateIndex
CREATE INDEX "Rol_deleted_idx" ON "Rol"("deleted");

-- CreateIndex
CREATE INDEX "Rol_nombre_idx" ON "Rol"("nombre");

-- CreateIndex
CREATE INDEX "Solicitud_fecha_salida_idx" ON "Solicitud"("fecha_salida");

-- CreateIndex
CREATE INDEX "Solicitud_created_at_idx" ON "Solicitud"("created_at");

-- CreateIndex
CREATE INDEX "Solicitud_fecha_retorno_idx" ON "Solicitud"("fecha_retorno");

-- CreateIndex
CREATE INDEX "Solicitud_deleted_idx" ON "Solicitud"("deleted");

-- CreateIndex
CREATE INDEX "Usuario_nombre_idx" ON "Usuario"("nombre");

-- CreateIndex
CREATE INDEX "Usuario_deleted_idx" ON "Usuario"("deleted");

-- CreateIndex
CREATE INDEX "UsuarioRol_rol_id_idx" ON "UsuarioRol"("rol_id");

-- CreateIndex
CREATE INDEX "UsuarioRol_usuario_id_idx" ON "UsuarioRol"("usuario_id");

-- AddForeignKey
ALTER TABLE "Requerimiento" ADD CONSTRAINT "Requerimiento_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
