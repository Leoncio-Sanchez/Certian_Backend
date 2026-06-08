import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Seed USUARIO_TIPO (Esquema Admin)
  // 1=Invitado, 2=Admin, 3=Estudiante, 4=Empresa
  const types = [
    { descripcion_tipo: 'Invitado' },
    { descripcion_tipo: 'Admin' },
    { descripcion_tipo: 'Estudiante' },
    { descripcion_tipo: 'Empresa' },
  ]

  for (const type of types) {
    await prisma.usuarioTipo.create({ data: type })
  }

  // 2. Seed NIVEL_DIFICULTAD (Esquema Empresa)
  const levels = [
    { nombre: 'basico', horas_por_defecto: 20 },
    { nombre: 'medio', horas_por_defecto: 40 },
    { nombre: 'avanzado', horas_por_defecto: 80 },
  ]

  for (const level of levels) {
    await prisma.nivelDificultad.create({ data: level as any })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
