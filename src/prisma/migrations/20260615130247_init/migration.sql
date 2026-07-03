-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Admin";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Empresa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Estudiante";

-- CreateEnum
CREATE TYPE "Empresa"."nivel_nombre_enum" AS ENUM ('basico', 'medio', 'avanzado');

-- CreateEnum
CREATE TYPE "Empresa"."status_enum" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "Empresa"."estado_reto_enum" AS ENUM ('abierto', 'cerrado');

-- CreateEnum
CREATE TYPE "Empresa"."estado_postulacion_enum" AS ENUM ('pendiente', 'en_revision', 'aprobado', 'rechazado');

-- CreateEnum
CREATE TYPE "Empresa"."tipo_accion_enum" AS ENUM ('invitacion_entrevista', 'seleccion_capacitacion', 'propuesta_contratacion');

-- CreateEnum
CREATE TYPE "Empresa"."estado_proceso_enum" AS ENUM ('pendiente', 'aceptado', 'rechazado');

-- CreateTable
CREATE TABLE "Admin"."USUARIO_TIPO" (
    "id_usuario_tipo" SERIAL NOT NULL,
    "descripcion_tipo" VARCHAR(50) NOT NULL,

    CONSTRAINT "USUARIO_TIPO_pkey" PRIMARY KEY ("id_usuario_tipo")
);

-- CreateTable
CREATE TABLE "Admin"."ROL" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(100) NOT NULL,

    CONSTRAINT "ROL_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Admin"."MODULO" (
    "id_modulo" SERIAL NOT NULL,
    "nombre_modulo" VARCHAR(100) NOT NULL,

    CONSTRAINT "MODULO_pkey" PRIMARY KEY ("id_modulo")
);

-- CreateTable
CREATE TABLE "Admin"."USUARIO" (
    "id_usuario" SERIAL NOT NULL,
    "id_usuario_tipo" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "estado_cuenta" SMALLINT DEFAULT 1,

    CONSTRAINT "USUARIO_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Admin"."USUARIO_ROL" (
    "id_usuario_rol" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "USUARIO_ROL_pkey" PRIMARY KEY ("id_usuario_rol","id_rol")
);

-- CreateTable
CREATE TABLE "Admin"."ROL_MODULO" (
    "id_rol_modulo" INTEGER NOT NULL,
    "id_modulo" INTEGER NOT NULL,

    CONSTRAINT "ROL_MODULO_pkey" PRIMARY KEY ("id_rol_modulo","id_modulo")
);

-- CreateTable
CREATE TABLE "Empresa"."NIVEL_DIFICULTAD" (
    "id_nivel_dificultad" SERIAL NOT NULL,
    "nombre" "Empresa"."nivel_nombre_enum" NOT NULL,
    "horas_por_defecto" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NIVEL_DIFICULTAD_pkey" PRIMARY KEY ("id_nivel_dificultad")
);

-- CreateTable
CREATE TABLE "Empresa"."EMPRESA" (
    "id_empresa" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "razon_social" VARCHAR(150) NOT NULL,
    "ruc" VARCHAR(11) NOT NULL,
    "logo_url" VARCHAR(255) NOT NULL,
    "rubro" VARCHAR(100),
    "status" "Empresa"."status_enum" DEFAULT 'activo',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EMPRESA_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "Empresa"."TEMA" (
    "id_tema" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TEMA_pkey" PRIMARY KEY ("id_tema")
);

-- CreateTable
CREATE TABLE "Empresa"."RETO" (
    "id_reto" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_tema" INTEGER NOT NULL,
    "id_nivel_dificultad" INTEGER NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion_problema" TEXT NOT NULL,
    "requisitos_entrega" TEXT NOT NULL,
    "estado" "Empresa"."estado_reto_enum" DEFAULT 'abierto',
    "imagen_url" VARCHAR(255),
    "documento_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RETO_pkey" PRIMARY KEY ("id_reto")
);

-- CreateTable
CREATE TABLE "Empresa"."POSTULACION" (
    "id_postulacion" SERIAL NOT NULL,
    "id_reto" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "repositorio_url" VARCHAR(255),
    "solucion_url" VARCHAR(255),
    "estado" "Empresa"."estado_postulacion_enum" DEFAULT 'pendiente',
    "feedback_tecnico" TEXT,
    "score_tech" DECIMAL(5,2) DEFAULT 0.00,
    "fecha_inicio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "POSTULACION_pkey" PRIMARY KEY ("id_postulacion")
);

-- CreateTable
CREATE TABLE "Empresa"."CERTIFICADO" (
    "id_certificado" SERIAL NOT NULL,
    "id_postulacion" INTEGER NOT NULL,
    "codigo_verificacion" VARCHAR(100) NOT NULL,
    "url_pdf" VARCHAR(255) NOT NULL,
    "fecha_emision" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CERTIFICADO_pkey" PRIMARY KEY ("id_certificado")
);

-- CreateTable
CREATE TABLE "Empresa"."INTERACCION_NETWORKING" (
    "id_interaccion_networking" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "tipo_accion" "Empresa"."tipo_accion_enum" NOT NULL,
    "mensaje_convocatoria" TEXT NOT NULL,
    "estado_proceso" "Empresa"."estado_proceso_enum" DEFAULT 'pendiente',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INTERACCION_NETWORKING_pkey" PRIMARY KEY ("id_interaccion_networking")
);

-- CreateTable
CREATE TABLE "Estudiante"."HABILIDAD" (
    "id_habilidad" SERIAL NOT NULL,
    "nombre_habilidad" VARCHAR(100) NOT NULL,
    "categoria" VARCHAR(50),

    CONSTRAINT "HABILIDAD_pkey" PRIMARY KEY ("id_habilidad")
);

-- CreateTable
CREATE TABLE "Estudiante"."ESTUDIANTE" (
    "id_estudiante" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "dni" VARCHAR(15) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "carrera" VARCHAR(100) NOT NULL,
    "ciclo" VARCHAR(20) NOT NULL,
    "correo_contacto" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "foto_perfil_url" VARCHAR(255),
    "puntos_ranking" INTEGER DEFAULT 0,

    CONSTRAINT "ESTUDIANTE_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Estudiante"."FORMACION_ACADEMICA" (
    "id_formacion_academica" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "universidad_instituto" VARCHAR(150) NOT NULL,
    "estado_estudio" VARCHAR(50) NOT NULL,
    "sello_universidad" BOOLEAN DEFAULT false,

    CONSTRAINT "FORMACION_ACADEMICA_pkey" PRIMARY KEY ("id_formacion_academica")
);

-- CreateTable
CREATE TABLE "Estudiante"."CERTIFICACION" (
    "id_certificacion" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "nombre_certificado" VARCHAR(150) NOT NULL,
    "organizacion_emisora" VARCHAR(150) NOT NULL,
    "fecha_expedicion" DATE NOT NULL,
    "url_credencial" VARCHAR(200),

    CONSTRAINT "CERTIFICACION_pkey" PRIMARY KEY ("id_certificacion")
);

-- CreateTable
CREATE TABLE "Estudiante"."ESTUDIANTE_RETO" (
    "id_estudiante_reto" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_reto" INTEGER NOT NULL,
    "estado_desarrollo" VARCHAR(50) DEFAULT 'En Progreso',
    "fecha_inicio" DATE DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega" DATE,
    "solucion_texto_url" TEXT,
    "contacto_networking" BOOLEAN DEFAULT false,

    CONSTRAINT "ESTUDIANTE_RETO_pkey" PRIMARY KEY ("id_estudiante_reto")
);

-- CreateTable
CREATE TABLE "Estudiante"."ESTUDIANTE_HABILIDAD" (
    "id_estudiante_habilidad" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_habilidad" INTEGER NOT NULL,
    "nivel_dominio" VARCHAR(50) NOT NULL,

    CONSTRAINT "ESTUDIANTE_HABILIDAD_pkey" PRIMARY KEY ("id_estudiante_habilidad")
);

-- CreateIndex
CREATE UNIQUE INDEX "USUARIO_username_key" ON "Admin"."USUARIO"("username");

-- CreateIndex
CREATE UNIQUE INDEX "NIVEL_DIFICULTAD_nombre_key" ON "Empresa"."NIVEL_DIFICULTAD"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "EMPRESA_id_usuario_key" ON "Empresa"."EMPRESA"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "EMPRESA_ruc_key" ON "Empresa"."EMPRESA"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "TEMA_nombre_key" ON "Empresa"."TEMA"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "uq_estudiante_reto_postulacion" ON "Empresa"."POSTULACION"("id_estudiante", "id_reto");

-- CreateIndex
CREATE UNIQUE INDEX "CERTIFICADO_id_postulacion_key" ON "Empresa"."CERTIFICADO"("id_postulacion");

-- CreateIndex
CREATE UNIQUE INDEX "CERTIFICADO_codigo_verificacion_key" ON "Empresa"."CERTIFICADO"("codigo_verificacion");

-- CreateIndex
CREATE UNIQUE INDEX "ESTUDIANTE_id_usuario_key" ON "Estudiante"."ESTUDIANTE"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "ESTUDIANTE_dni_key" ON "Estudiante"."ESTUDIANTE"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_ESTUDIANTE_RETO_COMPUESTA" ON "Estudiante"."ESTUDIANTE_RETO"("id_estudiante", "id_reto");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_ESTUDIANTE_HABILIDAD_COMPUESTA" ON "Estudiante"."ESTUDIANTE_HABILIDAD"("id_estudiante", "id_habilidad");

-- AddForeignKey
ALTER TABLE "Admin"."USUARIO" ADD CONSTRAINT "USUARIO_id_usuario_tipo_fkey" FOREIGN KEY ("id_usuario_tipo") REFERENCES "Admin"."USUARIO_TIPO"("id_usuario_tipo") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Admin"."USUARIO_ROL" ADD CONSTRAINT "USUARIO_ROL_id_usuario_rol_fkey" FOREIGN KEY ("id_usuario_rol") REFERENCES "Admin"."USUARIO"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin"."USUARIO_ROL" ADD CONSTRAINT "USUARIO_ROL_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Admin"."ROL"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin"."ROL_MODULO" ADD CONSTRAINT "ROL_MODULO_id_rol_modulo_fkey" FOREIGN KEY ("id_rol_modulo") REFERENCES "Admin"."ROL"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin"."ROL_MODULO" ADD CONSTRAINT "ROL_MODULO_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "Admin"."MODULO"("id_modulo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."EMPRESA" ADD CONSTRAINT "EMPRESA_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Admin"."USUARIO"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."RETO" ADD CONSTRAINT "RETO_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"."EMPRESA"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."RETO" ADD CONSTRAINT "RETO_id_tema_fkey" FOREIGN KEY ("id_tema") REFERENCES "Empresa"."TEMA"("id_tema") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."RETO" ADD CONSTRAINT "RETO_id_nivel_dificultad_fkey" FOREIGN KEY ("id_nivel_dificultad") REFERENCES "Empresa"."NIVEL_DIFICULTAD"("id_nivel_dificultad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."POSTULACION" ADD CONSTRAINT "POSTULACION_id_reto_fkey" FOREIGN KEY ("id_reto") REFERENCES "Empresa"."RETO"("id_reto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."POSTULACION" ADD CONSTRAINT "POSTULACION_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"."ESTUDIANTE"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."CERTIFICADO" ADD CONSTRAINT "CERTIFICADO_id_postulacion_fkey" FOREIGN KEY ("id_postulacion") REFERENCES "Empresa"."POSTULACION"("id_postulacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."INTERACCION_NETWORKING" ADD CONSTRAINT "INTERACCION_NETWORKING_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"."EMPRESA"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa"."INTERACCION_NETWORKING" ADD CONSTRAINT "INTERACCION_NETWORKING_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"."ESTUDIANTE"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."ESTUDIANTE" ADD CONSTRAINT "ESTUDIANTE_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Admin"."USUARIO"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."FORMACION_ACADEMICA" ADD CONSTRAINT "FORMACION_ACADEMICA_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"."ESTUDIANTE"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."CERTIFICACION" ADD CONSTRAINT "CERTIFICACION_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"."ESTUDIANTE"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."ESTUDIANTE_RETO" ADD CONSTRAINT "ESTUDIANTE_RETO_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"."ESTUDIANTE"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."ESTUDIANTE_RETO" ADD CONSTRAINT "ESTUDIANTE_RETO_id_reto_fkey" FOREIGN KEY ("id_reto") REFERENCES "Empresa"."RETO"("id_reto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."ESTUDIANTE_HABILIDAD" ADD CONSTRAINT "ESTUDIANTE_HABILIDAD_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"."ESTUDIANTE"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante"."ESTUDIANTE_HABILIDAD" ADD CONSTRAINT "ESTUDIANTE_HABILIDAD_id_habilidad_fkey" FOREIGN KEY ("id_habilidad") REFERENCES "Estudiante"."HABILIDAD"("id_habilidad") ON DELETE RESTRICT ON UPDATE CASCADE;
