import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Neon connection for source data
const neonDb = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_hpnzT3tHR6Fo@ep-divine-glade-ap4h4bor-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15',
    },
  },
});

const localDb = new PrismaClient();

async function main() {
  console.log('🔌 Conectando a Neon + Local...');
  await neonDb.$connect();
  await localDb.$connect();

  // Generate hash for admin123
  const passwordHash = await bcrypt.hash('admin123', 10);
  console.log('🔐 Todas las contraseñas serán: admin123\n');

  // ============================================================
  // 1. USUARIO_TIPO (upsert)
  // ============================================================
  console.log('[1/5] Tipos de usuario...');
  const neonTipos: any[] = await neonDb.$queryRawUnsafe(`SELECT * FROM "Admin"."USUARIO_TIPO"`);
  for (const t of neonTipos) {
    await localDb.usuarioTipo.upsert({
      where: { id_usuario_tipo: t.id_usuario_tipo },
      create: t,
      update: { descripcion_tipo: t.descripcion_tipo },
    });
  }
  console.log(`  ✓ ${neonTipos.length} tipos`);

  // ============================================================
  // 2. USUARIOS (extract from Neon, upsert to local with admin123)
  // ============================================================
  console.log('[2/5] Usuarios...');
  const neonUsers: any[] = await neonDb.$queryRawUnsafe(`SELECT * FROM "Admin"."USUARIO" ORDER BY id_usuario`);

  // Also keep existing local users that are NOT in Neon
  const localExistingUsernames = new Set((await localDb.usuario.findMany({ select: { username: true } })).map(u => u.username));
  
  let created = 0, updated = 0;
  for (const u of neonUsers) {
    const exists = await localDb.usuario.findUnique({ where: { username: u.username } });
    if (exists) {
      // Update password to admin123
      await localDb.usuario.update({
        where: { id_usuario: exists.id_usuario },
        data: {
          password: passwordHash,
          estado_cuenta: 1,
          id_usuario_tipo: u.id_usuario_tipo,
        },
      });
      updated++;
    } else {
      await localDb.usuario.create({
        data: {
          username: u.username,
          password: passwordHash,
          id_usuario_tipo: u.id_usuario_tipo,
          estado_cuenta: 1,
        },
      });
      created++;
    }
  }
  console.log(`  ✓ ${created} creados, ${updated} actualizados — todos con admin123`);

  // ============================================================
  // 3. EMPRESAS
  // ============================================================
  console.log('[3/5] Empresas...');
  const neonEmpresas: any[] = await neonDb.$queryRawUnsafe(`SELECT * FROM "Empresa"."EMPRESA" ORDER BY id_empresa`);
  let empOk = 0;
  for (const e of neonEmpresas) {
    const user = await localDb.usuario.findUnique({ where: { username: (await neonDb.$queryRawUnsafe<any[]>(`SELECT username FROM "Admin"."USUARIO" WHERE id_usuario = ${e.id_usuario}`))[0]?.username } });
    // Find user by neon id_usuario mapped to local
    // Actually let's use a direct approach - find by RUC
    const existsByRuc = await localDb.empresa.findUnique({ where: { ruc: e.ruc } });
    if (existsByRuc) {
      empOk++;
      continue;
    }
    // Find local user by searching with the neon username
    const neonUserRow: any[] = await neonDb.$queryRawUnsafe(`SELECT username FROM "Admin"."USUARIO" WHERE id_usuario = ${e.id_usuario}`);
    if (!neonUserRow.length) continue;
    const localUser = await localDb.usuario.findUnique({ where: { username: neonUserRow[0].username } });
    if (!localUser) continue;
    
    const existsByUser = await localDb.empresa.findUnique({ where: { id_usuario: localUser.id_usuario } });
    if (existsByUser) { empOk++; continue; }

    await localDb.empresa.create({
      data: {
        id_usuario: localUser.id_usuario,
        razon_social: e.razon_social,
        ruc: e.ruc,
        logo_url: e.logo_url || '',
        rubro: e.rubro || null,
        status: e.status || 'activo',
      },
    });
    empOk++;
    console.log(`  ✓ ${e.razon_social}`);
  }
  console.log(`  ✓ ${empOk} empresas`);

  // ============================================================
  // 4. ESTUDIANTES
  // ============================================================
  console.log('[4/5] Estudiantes...');
  const neonEstudiantes: any[] = await neonDb.$queryRawUnsafe(`SELECT * FROM "Estudiante"."ESTUDIANTE" ORDER BY id_estudiante`);
  let estOk = 0;
  for (const e of neonEstudiantes) {
    const neonUserRow: any[] = await neonDb.$queryRawUnsafe(`SELECT username FROM "Admin"."USUARIO" WHERE id_usuario = ${e.id_usuario}`);
    if (!neonUserRow.length) continue;
    const localUser = await localDb.usuario.findUnique({ where: { username: neonUserRow[0].username } });
    if (!localUser) continue;

    const existsByDni = await localDb.estudiante.findUnique({ where: { dni: e.dni } });
    if (existsByDni) {
      // Update if needed
      await localDb.estudiante.update({
        where: { id_estudiante: existsByDni.id_estudiante },
        data: {
          nombres: e.nombres || existsByDni.nombres,
          apellidos: e.apellidos || existsByDni.apellidos,
          carrera: e.carrera || existsByDni.carrera,
          ciclo: e.ciclo || existsByDni.ciclo,
          correo_contacto: e.correo_contacto || existsByDni.correo_contacto,
          telefono: e.telefono || null,
        },
      });
      estOk++;
      continue;
    }
    const existsByUser = await localDb.estudiante.findUnique({ where: { id_usuario: localUser.id_usuario } });
    if (existsByUser) {
      await localDb.estudiante.update({
        where: { id_estudiante: existsByUser.id_estudiante },
        data: {
          dni: e.dni,
          nombres: e.nombres || '',
          apellidos: e.apellidos || '',
          carrera: e.carrera || 'General',
          ciclo: e.ciclo || '1ro',
          correo_contacto: e.correo_contacto || '',
          telefono: e.telefono || null,
        },
      });
      estOk++;
      continue;
    }

    await localDb.estudiante.create({
      data: {
        id_usuario: localUser.id_usuario,
        dni: e.dni,
        nombres: e.nombres || '',
        apellidos: e.apellidos || '',
        carrera: e.carrera || 'General',
        ciclo: e.ciclo || '1ro',
        correo_contacto: e.correo_contacto || '',
        telefono: e.telefono || null,
        puntos_ranking: e.puntos_ranking || 0,
      },
    });
    estOk++;
    console.log(`  ✓ ${e.nombres} ${e.apellidos}`);
  }
  console.log(`  ✓ ${estOk} estudiantes`);

  // ============================================================
  // 5. FORMACION_ACADEMICA
  // ============================================================
  console.log('[5/5] Formación académica...');
  const neonFormacion: any[] = await neonDb.$queryRawUnsafe(`SELECT * FROM "Estudiante"."FORMACION_ACADEMICA"`);
  let formOk = 0;
  for (const f of neonFormacion) {
    const neonEst: any[] = await neonDb.$queryRawUnsafe(`SELECT e.*, u.username FROM "Estudiante"."ESTUDIANTE" e JOIN "Admin"."USUARIO" u ON u.id_usuario = e.id_usuario WHERE e.id_estudiante = ${f.id_estudiante}`);
    if (!neonEst.length) continue;
    const localUser = await localDb.usuario.findUnique({ where: { username: neonEst[0].username } });
    if (!localUser) continue;
    const localEst = await localDb.estudiante.findUnique({ where: { id_usuario: localUser.id_usuario } });
    if (!localEst) continue;

    // Check if already exists for this student
    const existing = await localDb.formacionAcademica.findFirst({ where: { id_estudiante: localEst.id_estudiante } });
    if (existing) { formOk++; continue; }

    await localDb.formacionAcademica.create({
      data: {
        id_estudiante: localEst.id_estudiante,
        universidad_instituto: f.universidad_instituto || 'Universidad Peruana Unión',
        estado_estudio: f.estado_estudio || 'En curso',
        sello_universidad: f.sello_universidad || false,
      },
    });
    formOk++;
  }
  console.log(`  ✓ ${formOk} registros`);

  await neonDb.$disconnect();
  await localDb.$disconnect();

  console.log('\n✅ SEED COMPLETADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Todas las cuentas:');
  console.log('   Contraseña: admin123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(e => {
  console.error('❌', e);
  process.exit(1);
});
