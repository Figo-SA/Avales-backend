-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "disciplina_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateTable
CREATE TABLE "ColeccionAval" (
    "id" SERIAL NOT NULL,
    "nombre_evento" TEXT NOT NULL,
    "lugar_evento" TEXT NOT NULL,
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "disciplina_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "ciudad" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColeccionAval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeportistaAval" (
    "id" SERIAL NOT NULL,
    "coleccion_aval_id" INTEGER NOT NULL,
    "deportista_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeportistaAval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialColeccion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "coleccion_aval_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialColeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "archivo" TEXT NOT NULL,
    "objetivos" TEXT NOT NULL,
    "criterios" TEXT NOT NULL,
    "fecha_salida" TIMESTAMP(3) NOT NULL,
    "ruta_salida" TEXT NOT NULL,
    "transporte_salida" TEXT NOT NULL,
    "fecha_retorno" TIMESTAMP(3) NOT NULL,
    "hora_retorno" TIMESTAMP(3) NOT NULL,
    "transporte_retorno" TEXT NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requerimiento" (
    "id" SERIAL NOT NULL,
    "tecnico_id" INTEGER NOT NULL,
    "rubro" TEXT NOT NULL,
    "cantidad_dias" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requerimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialSolicitud" (
    "id" SERIAL NOT NULL,
    "estado" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "solicitud_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialSolicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deportista" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deportista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "actividad_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pda" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "responsable_anticipo" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialPda" (
    "id" SERIAL NOT NULL,
    "estado" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "pda_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialPda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdaItem" (
    "id" SERIAL NOT NULL,
    "pda_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "presupuesto" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dtm" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "observacion" TEXT,
    "fecha_presentacion" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dtm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialDtm" (
    "id" SERIAL NOT NULL,
    "estado" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "dtm_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialDtm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financiero" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cuenta_bancaria" TEXT NOT NULL,
    "fondos" TEXT NOT NULL,
    "notas" TEXT,
    "razon_social" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Financiero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialFinanciero" (
    "id" SERIAL NOT NULL,
    "estado" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "financiero_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistorialFinanciero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancieroItem" (
    "id" SERIAL NOT NULL,
    "financiero_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "precio_asignado" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancieroItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Deportista_cedula_key" ON "Deportista"("cedula");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColeccionAval" ADD CONSTRAINT "ColeccionAval_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_coleccion_aval_id_fkey" FOREIGN KEY ("coleccion_aval_id") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeportistaAval" ADD CONSTRAINT "DeportistaAval_deportista_id_fkey" FOREIGN KEY ("deportista_id") REFERENCES "Deportista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialColeccion" ADD CONSTRAINT "HistorialColeccion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialColeccion" ADD CONSTRAINT "HistorialColeccion_coleccion_aval_id_fkey" FOREIGN KEY ("coleccion_aval_id") REFERENCES "ColeccionAval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requerimiento" ADD CONSTRAINT "Requerimiento_tecnico_id_fkey" FOREIGN KEY ("tecnico_id") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialSolicitud" ADD CONSTRAINT "HistorialSolicitud_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialSolicitud" ADD CONSTRAINT "HistorialSolicitud_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPda" ADD CONSTRAINT "HistorialPda_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPda" ADD CONSTRAINT "HistorialPda_pda_id_fkey" FOREIGN KEY ("pda_id") REFERENCES "Pda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdaItem" ADD CONSTRAINT "PdaItem_pda_id_fkey" FOREIGN KEY ("pda_id") REFERENCES "Pda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdaItem" ADD CONSTRAINT "PdaItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialDtm" ADD CONSTRAINT "HistorialDtm_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialDtm" ADD CONSTRAINT "HistorialDtm_dtm_id_fkey" FOREIGN KEY ("dtm_id") REFERENCES "Dtm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialFinanciero" ADD CONSTRAINT "HistorialFinanciero_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialFinanciero" ADD CONSTRAINT "HistorialFinanciero_financiero_id_fkey" FOREIGN KEY ("financiero_id") REFERENCES "Financiero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancieroItem" ADD CONSTRAINT "FinancieroItem_financiero_id_fkey" FOREIGN KEY ("financiero_id") REFERENCES "Financiero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancieroItem" ADD CONSTRAINT "FinancieroItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
