import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // 1. Seed USUARIO_TIPO (Esquema Admin)
  const types = [
    { id_usuario_tipo: 1, descripcion_tipo: 'Invitado' },
    { id_usuario_tipo: 2, descripcion_tipo: 'Admin' },
    { id_usuario_tipo: 3, descripcion_tipo: 'Estudiante' },
    { id_usuario_tipo: 4, descripcion_tipo: 'Empresa' },
  ]

  for (const type of types) {
    await prisma.usuarioTipo.upsert({
      where: { id_usuario_tipo: type.id_usuario_tipo },
      update: { descripcion_tipo: type.descripcion_tipo },
      create: type
    })
  }

  // 2. Seed ROL (Esquema Admin)
  const roles = [
    { id_rol: 1, nombre_rol: 'SUPERADMIN' },
    { id_rol: 2, nombre_rol: 'ADMIN' },
    { id_rol: 3, nombre_rol: 'USER' },
  ]

  for (const rol of roles) {
    await prisma.rol.upsert({
      where: { id_rol: rol.id_rol },
      update: { nombre_rol: rol.nombre_rol },
      create: rol
    })
  }

  // 3. Seed NIVEL_DIFICULTAD (Esquema Empresa)
  const levels = [
    { id_nivel_dificultad: 1, nombre: 'basico', horas_por_defecto: 20 },
    { id_nivel_dificultad: 2, nombre: 'medio', horas_por_defecto: 40 },
    { id_nivel_dificultad: 3, nombre: 'avanzado', horas_por_defecto: 80 },
  ]

  for (const level of levels) {
    await prisma.nivelDificultad.upsert({
      where: { id_nivel_dificultad: level.id_nivel_dificultad },
      update: { nombre: level.nombre as any, horas_por_defecto: level.horas_por_defecto },
      create: level as any
    })
  }

  // 4. Create SuperAdmin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where: { username: 'admin@certian.com' },
    update: { password: hashedPassword },
    create: {
      username: 'admin@certian.com',
      password: hashedPassword,
      id_usuario_tipo: 2, // Admin
      estado_cuenta: 1,
    }
  })

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
