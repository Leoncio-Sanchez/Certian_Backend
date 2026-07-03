-- CreateTable
CREATE TABLE "Estudiante"."PASO_EVIDENCIA" (
    "id_paso_evidencia" SERIAL NOT NULL,
    "id_estudiante_reto" INTEGER NOT NULL,
    "id_paso_reto" INTEGER NOT NULL,
    "url_evidencia" TEXT NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PASO_EVIDENCIA_pkey" PRIMARY KEY ("id_paso_evidencia")
);
