-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('DISPONIBLE', 'SOLICITADO', 'RECHAZADO', 'ACEPTADO');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'MASCULINO_FEMENINO');

-- CreateEnum
CREATE TYPE "TipoRol" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SECRETARIA', 'DTM', 'DTM_EIDE', 'ENTRENADOR', 'USUARIO', 'DEPORTISTA', 'PDA', 'FINANCIERO');

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" "TipoRol" NOT NULL,
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
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "pushToken" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Disciplina" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Entrenador" (
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

    CONSTRAINT "Entrenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "tipoParticipacion" VARCHAR(100) NOT NULL,
    "tipoEvento" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "lugar" VARCHAR(255) NOT NULL,
    "genero" "Genero" NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "pais" VARCHAR(100) NOT NULL,
    "alcance" VARCHAR(100) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "numEntrenadoresHombres" INTEGER NOT NULL,
    "numEntrenadoresMujeres" INTEGER NOT NULL,
    "numAtletasHombres" INTEGER NOT NULL,
    "numAtletasMujeres" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "estado" "Estado" NOT NULL DEFAULT 'DISPONIBLE',
    "archivo" VARCHAR(355),

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColeccionAval" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(600),
    "eventoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColeccionAval_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "AvalTecnico" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "descripcion" VARCHAR(600),
    "archivo" VARCHAR(355),
    "fechaHoraSalida" TIMESTAMP(3) NOT NULL,
    "fechaHoraRetorno" TIMESTAMP(3) NOT NULL,
    "transporteSalida" VARCHAR(255) NOT NULL,
    "transporteRetorno" VARCHAR(255) NOT NULL,
    "entrenadores" INTEGER NOT NULL,
    "atletas" INTEGER NOT NULL,
    "observaciones" VARCHAR(600),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvalTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalObjetivo" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,

    CONSTRAINT "AvalObjetivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalCriterio" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "descripcion" VARCHAR(600) NOT NULL,

    CONSTRAINT "AvalCriterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubro" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(600),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvalRequerimiento" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "rubroId" INTEGER NOT NULL,
    "cantidadDias" VARCHAR(255) NOT NULL,
    "valorUnitario" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvalRequerimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialAvalTecnico" (
    "id" SERIAL NOT NULL,
    "estado" "Estado" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialAvalTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeportistaAval" (
    "id" SERIAL NOT NULL,
    "avalTecnicoId" INTEGER NOT NULL,
    "deportistaId" INTEGER NOT NULL,
    "rol" VARCHAR(100) NOT NULL,

    CONSTRAINT "DeportistaAval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColeccionEntrenador" (
    "id" SERIAL NOT NULL,
    "coleccionAvalId" INTEGER NOT NULL,
    "entrenadorId" INTEGER NOT NULL,
    "rol" VARCHAR(100) NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL,

    CONSTRAINT "ColeccionEntrenador_pkey" PRIMARY KEY ("id")
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
    "presupuesto" DECIMAL(12,2) NOT NULL,
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
    "precioAsignado" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancieroItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE INDEX "Rol_deleted_idx" ON "Rol"("deleted");

-- CreateIndex
CREATE INDEX "Rol_nombre_idx" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE INDEX "Usuario_nombre_idx" ON "Usuario"("nombre");

-- CreateIndex
CREATE INDEX "Usuario_deleted_idx" ON "Usuario"("deleted");

-- CreateIndex
CREATE INDEX "Usuario_resetPasswordToken_idx" ON "Usuario"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "UsuarioRol_usuarioId_idx" ON "UsuarioRol"("usuarioId");

-- CreateIndex
CREATE INDEX "UsuarioRol_rolId_idx" ON "UsuarioRol"("rolId");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_nombre_key" ON "Disciplina"("nombre");

-- CreateIndex
CREATE INDEX "Disciplina_deleted_idx" ON "Disciplina"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Categoria_deleted_idx" ON "Categoria"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Deportista_cedula_key" ON "Deportista"("cedula");

-- CreateIndex
CREATE INDEX "Deportista_nombres_idx" ON "Deportista"("nombres");

-- CreateIndex
CREATE INDEX "Deportista_categoriaId_idx" ON "Deportista"("categoriaId");

-- CreateIndex
CREATE INDEX "Deportista_deleted_idx" ON "Deportista"("deleted");

-- CreateIndex
CREATE INDEX "Deportista_cedula_idx" ON "Deportista"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Entrenador_cedula_key" ON "Entrenador"("cedula");

-- CreateIndex
CREATE INDEX "Entrenador_nombres_idx" ON "Entrenador"("nombres");

-- CreateIndex
CREATE INDEX "Entrenador_categoriaId_idx" ON "Entrenador"("categoriaId");

-- CreateIndex
CREATE INDEX "Entrenador_deleted_idx" ON "Entrenador"("deleted");

-- CreateIndex
CREATE INDEX "Entrenador_cedula_idx" ON "Entrenador"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_codigo_key" ON "Evento"("codigo");

-- CreateIndex
CREATE INDEX "Evento_nombre_idx" ON "Evento"("nombre");

-- CreateIndex
CREATE INDEX "Evento_fechaInicio_idx" ON "Evento"("fechaInicio");

-- CreateIndex
CREATE INDEX "HistorialColeccion_usuarioId_idx" ON "HistorialColeccion"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialColeccion_estado_idx" ON "HistorialColeccion"("estado");

-- CreateIndex
CREATE INDEX "HistorialColeccion_createdAt_idx" ON "HistorialColeccion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AvalTecnico_coleccionAvalId_key" ON "AvalTecnico"("coleccionAvalId");

-- CreateIndex
CREATE INDEX "AvalTecnico_coleccionAvalId_idx" ON "AvalTecnico"("coleccionAvalId");

-- CreateIndex
CREATE INDEX "AvalTecnico_fechaHoraSalida_idx" ON "AvalTecnico"("fechaHoraSalida");

-- CreateIndex
CREATE INDEX "AvalTecnico_fechaHoraRetorno_idx" ON "AvalTecnico"("fechaHoraRetorno");

-- CreateIndex
CREATE INDEX "AvalTecnico_createdAt_idx" ON "AvalTecnico"("createdAt");

-- CreateIndex
CREATE INDEX "AvalTecnico_deleted_idx" ON "AvalTecnico"("deleted");

-- CreateIndex
CREATE INDEX "AvalObjetivo_avalTecnicoId_idx" ON "AvalObjetivo"("avalTecnicoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvalObjetivo_avalTecnicoId_orden_key" ON "AvalObjetivo"("avalTecnicoId", "orden");

-- CreateIndex
CREATE INDEX "AvalCriterio_avalTecnicoId_idx" ON "AvalCriterio"("avalTecnicoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvalCriterio_avalTecnicoId_orden_key" ON "AvalCriterio"("avalTecnicoId", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_key" ON "Rubro"("nombre");

-- CreateIndex
CREATE INDEX "Rubro_nombre_idx" ON "Rubro"("nombre");

-- CreateIndex
CREATE INDEX "Rubro_deleted_idx" ON "Rubro"("deleted");

-- CreateIndex
CREATE INDEX "AvalRequerimiento_avalTecnicoId_idx" ON "AvalRequerimiento"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "AvalRequerimiento_rubroId_idx" ON "AvalRequerimiento"("rubroId");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_usuarioId_idx" ON "HistorialAvalTecnico"("usuarioId");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_estado_idx" ON "HistorialAvalTecnico"("estado");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_createdAt_idx" ON "HistorialAvalTecnico"("createdAt");

-- CreateIndex
CREATE INDEX "HistorialAvalTecnico_avalTecnicoId_idx" ON "HistorialAvalTecnico"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "DeportistaAval_avalTecnicoId_idx" ON "DeportistaAval"("avalTecnicoId");

-- CreateIndex
CREATE INDEX "DeportistaAval_deportistaId_idx" ON "DeportistaAval"("deportistaId");

-- CreateIndex
CREATE UNIQUE INDEX "DeportistaAval_avalTecnicoId_deportistaId_key" ON "DeportistaAval"("avalTecnicoId", "deportistaId");

-- CreateIndex
CREATE INDEX "ColeccionEntrenador_entrenadorId_idx" ON "ColeccionEntrenador"("entrenadorId");

-- CreateIndex
CREATE UNIQUE INDEX "ColeccionEntrenador_coleccionAvalId_entrenadorId_key" ON "ColeccionEntrenador"("coleccionAvalId", "entrenadorId");

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
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrenador" ADD CONSTRAINT "Entrenador_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrenador" ADD CONSTRAINT "Entrenador_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialColeccion" ADD CONSTRAINT "HistorialColeccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialColeccion" ADD CONSTRAINT "HistorialColeccion_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalTecnico" ADD CONSTRAINT "AvalTecnico_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalObjetivo" ADD CONSTRAINT "AvalObjetivo_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalCriterio" ADD CONSTRAINT "AvalCriterio_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalRequerimiento" ADD CONSTRAINT "AvalRequerimiento_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvalRequerimiento" ADD CONSTRAINT "AvalRequerimiento_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialAvalTecnico" ADD CONSTRAINT "HistorialAvalTecnico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialAvalTecnico" ADD CONSTRAINT "HistorialAvalTecnico_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_avalTecnicoId_fkey" FOREIGN KEY ("avalTecnicoId") REFERENCES "AvalTecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_deportistaId_fkey" FOREIGN KEY ("deportistaId") REFERENCES "Deportista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionEntrenador" ADD CONSTRAINT "ColeccionEntrenador_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "Entrenador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionEntrenador" ADD CONSTRAINT "ColeccionEntrenador_coleccionAvalId_fkey" FOREIGN KEY ("coleccionAvalId") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
