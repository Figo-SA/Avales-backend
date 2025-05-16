-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'APROBADO', 'ACTIVO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'MASCULINO_FEMENINO');

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "usuarioId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuarioId","rolId")
);

-- CreateTable
CREATE TABLE "ColeccionAval" (
    "id" SERIAL NOT NULL,
    "nombreEvento" VARCHAR(400) NOT NULL,
    "lugarEvento" VARCHAR(255) NOT NULL,
    "fechaEvento" TIMESTAMP(3) NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "ciudad" VARCHAR(255) NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ColeccionAval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeportistaAval" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "deportistaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeportistaAval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialColeccion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialColeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "archivo" VARCHAR(355) NOT NULL,
    "objetivos" VARCHAR(600) NOT NULL,
    "criterios" VARCHAR(600) NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "rutaSalida" VARCHAR(255) NOT NULL,
    "transporteSalida" VARCHAR(255) NOT NULL,
    "fechaRetorno" TIMESTAMP(3) NOT NULL,
    "horaRetorno" TIMESTAMP(3) NOT NULL,
    "transporteRetorno" VARCHAR(255) NOT NULL,
    "observaciones" VARCHAR(600),
    "coleccionAvalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requerimiento" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "rubro" VARCHAR(255) NOT NULL,
    "cantidadDias" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requerimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialSolicitud" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialSolicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deportista" (
    "id" SERIAL NOT NULL,
    "nombres" VARCHAR(150) NOT NULL,
    "apellidos" VARCHAR(150) NOT NULL,
    "cedula" VARCHAR(50) NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "afiliacion" BOOLEAN NOT NULL DEFAULT false,
    "genero" "Genero" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Deportista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "numero" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "numero" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pda" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "documento" VARCHAR(355) NOT NULL,
    "responsableAnticipo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Pda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialPda" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "pdaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialPda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdaItem" (
    "id" SERIAL NOT NULL,
    "pdaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "presupuesto" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dtm" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "documento" VARCHAR(355) NOT NULL,
    "observacion" VARCHAR(600),
    "fechaPresentacion" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Dtm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialDtm" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "dtmId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialDtm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financiero" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,
    "cuentaBancaria" VARCHAR(255) NOT NULL,
    "fondos" VARCHAR(255) NOT NULL,
    "notas" VARCHAR(400),
    "razonSocial" VARCHAR(255) NOT NULL,
    "ruc" VARCHAR(50) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Financiero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialFinanciero" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "financieroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialFinanciero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancieroItem" (
    "id" SERIAL NOT NULL,
    "financieroId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "precioAsignado" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancieroItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rol_deleted_idx" ON "Rol"("deleted");

-- CreateIndex
CREATE INDEX "Rol_nombre_idx" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_nombre_idx" ON "Usuario"("nombre");

-- CreateIndex
CREATE INDEX "Usuario_deleted_idx" ON "Usuario"("deleted");

-- CreateIndex
CREATE INDEX "Disciplina_deleted_idx" ON "Disciplina"("deleted");

-- CreateIndex
CREATE INDEX "Categoria_deleted_idx" ON "Categoria"("deleted");

-- CreateIndex
CREATE INDEX "UsuarioRol_usuarioId_idx" ON "UsuarioRol"("usuarioId");

-- CreateIndex
CREATE INDEX "UsuarioRol_rolId_idx" ON "UsuarioRol"("rolId");

-- CreateIndex
CREATE INDEX "ColeccionAval_disciplinaId_idx" ON "ColeccionAval"("disciplinaId");

-- CreateIndex
CREATE INDEX "ColeccionAval_categoriaId_idx" ON "ColeccionAval"("categoriaId");

-- CreateIndex
CREATE INDEX "ColeccionAval_deleted_idx" ON "ColeccionAval"("deleted");

-- CreateIndex
CREATE INDEX "ColeccionAval_estado_idx" ON "ColeccionAval"("estado");

-- CreateIndex
CREATE INDEX "DeportistaAval_coleccionAvalId_idx" ON "DeportistaAval"("coleccionAvalId");

-- CreateIndex
CREATE INDEX "DeportistaAval_deportistaId_idx" ON "DeportistaAval"("deportistaId");

-- CreateIndex
CREATE INDEX "HistorialColeccion_usuarioId_idx" ON "HistorialColeccion"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialColeccion_estado_idx" ON "HistorialColeccion"("estado");

-- CreateIndex
CREATE INDEX "HistorialColeccion_createdAt_idx" ON "HistorialColeccion"("createdAt");

-- CreateIndex
CREATE INDEX "Solicitud_coleccionAvalId_idx" ON "Solicitud"("coleccionAvalId");

-- CreateIndex
CREATE INDEX "Solicitud_fechaSalida_idx" ON "Solicitud"("fechaSalida");

-- CreateIndex
CREATE INDEX "Solicitud_fechaRetorno_idx" ON "Solicitud"("fechaRetorno");

-- CreateIndex
CREATE INDEX "Solicitud_createdAt_idx" ON "Solicitud"("createdAt");

-- CreateIndex
CREATE INDEX "Solicitud_deleted_idx" ON "Solicitud"("deleted");

-- CreateIndex
CREATE INDEX "Requerimiento_solicitudId_idx" ON "Requerimiento"("solicitudId");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_usuarioId_idx" ON "HistorialSolicitud"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_estado_idx" ON "HistorialSolicitud"("estado");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_createdAt_idx" ON "HistorialSolicitud"("createdAt");

-- CreateIndex
CREATE INDEX "HistorialSolicitud_solicitudId_idx" ON "HistorialSolicitud"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "Deportista_cedula_key" ON "Deportista"("cedula");

-- CreateIndex
CREATE INDEX "Deportista_nombres_idx" ON "Deportista"("nombres");

-- CreateIndex
CREATE INDEX "Deportista_categoriaId_idx" ON "Deportista"("categoriaId");

-- CreateIndex
CREATE INDEX "Deportista_deleted_idx" ON "Deportista"("deleted");

-- CreateIndex
CREATE INDEX "Actividad_numero_idx" ON "Actividad"("numero");

-- CreateIndex
CREATE INDEX "Item_actividadId_idx" ON "Item"("actividadId");

-- CreateIndex
CREATE INDEX "Item_numero_idx" ON "Item"("numero");

-- CreateIndex
CREATE INDEX "Pda_createdAt_idx" ON "Pda"("createdAt");

-- CreateIndex
CREATE INDEX "Pda_deleted_idx" ON "Pda"("deleted");

-- CreateIndex
CREATE INDEX "HistorialPda_usuarioId_idx" ON "HistorialPda"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialPda_estado_idx" ON "HistorialPda"("estado");

-- CreateIndex
CREATE INDEX "HistorialPda_createdAt_idx" ON "HistorialPda"("createdAt");

-- CreateIndex
CREATE INDEX "HistorialPda_pdaId_idx" ON "HistorialPda"("pdaId");

-- CreateIndex
CREATE INDEX "PdaItem_pdaId_idx" ON "PdaItem"("pdaId");

-- CreateIndex
CREATE INDEX "PdaItem_itemId_idx" ON "PdaItem"("itemId");

-- CreateIndex
CREATE INDEX "Dtm_createdAt_idx" ON "Dtm"("createdAt");

-- CreateIndex
CREATE INDEX "Dtm_fechaPresentacion_idx" ON "Dtm"("fechaPresentacion");

-- CreateIndex
CREATE INDEX "Dtm_descripcion_idx" ON "Dtm"("descripcion");

-- CreateIndex
CREATE INDEX "Dtm_deleted_idx" ON "Dtm"("deleted");

-- CreateIndex
CREATE INDEX "HistorialDtm_usuarioId_idx" ON "HistorialDtm"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialDtm_estado_idx" ON "HistorialDtm"("estado");

-- CreateIndex
CREATE INDEX "HistorialDtm_createdAt_idx" ON "HistorialDtm"("createdAt");

-- CreateIndex
CREATE INDEX "HistorialDtm_dtmId_idx" ON "HistorialDtm"("dtmId");

-- CreateIndex
CREATE INDEX "Financiero_createdAt_idx" ON "Financiero"("createdAt");

-- CreateIndex
CREATE INDEX "Financiero_descripcion_idx" ON "Financiero"("descripcion");

-- CreateIndex
CREATE INDEX "Financiero_deleted_idx" ON "Financiero"("deleted");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_usuarioId_idx" ON "HistorialFinanciero"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_estado_idx" ON "HistorialFinanciero"("estado");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_createdAt_idx" ON "HistorialFinanciero"("createdAt");

-- CreateIndex
CREATE INDEX "HistorialFinanciero_financieroId_idx" ON "HistorialFinanciero"("financieroId");

-- CreateIndex
CREATE INDEX "FinancieroItem_financieroId_idx" ON "FinancieroItem"("financieroId");

-- CreateIndex
CREATE INDEX "FinancieroItem_itemId_idx" ON "FinancieroItem"("itemId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_deportistaId_fkey" FOREIGN KEY ("deportistaId") REFERENCES "Deportista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialColeccion" ADD CONSTRAINT "HistorialColeccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialColeccion" ADD CONSTRAINT "HistorialColeccion_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requerimiento" ADD CONSTRAINT "Requerimiento_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialSolicitud" ADD CONSTRAINT "HistorialSolicitud_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialSolicitud" ADD CONSTRAINT "HistorialSolicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pda" ADD CONSTRAINT "Pda_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPda" ADD CONSTRAINT "HistorialPda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPda" ADD CONSTRAINT "HistorialPda_pdaId_fkey" FOREIGN KEY ("pdaId") REFERENCES "Pda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdaItem" ADD CONSTRAINT "PdaItem_pdaId_fkey" FOREIGN KEY ("pdaId") REFERENCES "Pda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdaItem" ADD CONSTRAINT "PdaItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dtm" ADD CONSTRAINT "Dtm_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialDtm" ADD CONSTRAINT "HistorialDtm_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialDtm" ADD CONSTRAINT "HistorialDtm_dtmId_fkey" FOREIGN KEY ("dtmId") REFERENCES "Dtm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financiero" ADD CONSTRAINT "Financiero_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialFinanciero" ADD CONSTRAINT "HistorialFinanciero_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialFinanciero" ADD CONSTRAINT "HistorialFinanciero_financieroId_fkey" FOREIGN KEY ("financieroId") REFERENCES "Financiero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancieroItem" ADD CONSTRAINT "FinancieroItem_financieroId_fkey" FOREIGN KEY ("financieroId") REFERENCES "Financiero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancieroItem" ADD CONSTRAINT "FinancieroItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
