-- CreateTable
CREATE TABLE "Empresa"."PASO_RETO" (
    "id_paso_reto" SERIAL NOT NULL,
    "id_reto" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PASO_RETO_pkey" PRIMARY KEY ("id_paso_reto")
);

-- AddForeignKey
ALTER TABLE "Empresa"."PASO_RETO" ADD CONSTRAINT "PASO_RETO_id_reto_fkey" FOREIGN KEY ("id_reto") REFERENCES "Empresa"."RETO"("id_reto") ON DELETE CASCADE ON UPDATE CASCADE;
