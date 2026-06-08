import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';

export class AuthService {
  // Mapping for User Types based on Seed
  // 1=Invitado, 2=Admin, 3=Estudiante, 4=Empresa
  private roleToId(role: string): number {
    const roles: Record<string, number> = {
      'INVITADO': 1,
      'ADMIN': 2,
      'ESTUDIANTE': 3,
      'EMPRESA': 4
    };
    return roles[role?.toUpperCase()] || 3; // Default to Estudiante if not provided
  }

  public async registerUser(userData: any) {
    // Robust extraction: accepts username OR email
    const username = userData.username || userData.email;
    const password = userData.password;
    const role = userData.role || 'Estudiante';

    if (!username || !password) {
      throw new Error('Username (or Email) and password are required');
    }

    // 1. Check if User exists
    const existingUser = await prisma.usuario.findFirst({ where: { username } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const id_usuario_tipo = this.roleToId(role);

    // 2. Pre-validation for unique fields (with fallback for missing frontend fields)
    let finalDni = userData.dni || userData.profileData?.dni;
    let finalRuc = userData.ruc || userData.profileData?.ruc;

    if (id_usuario_tipo === 3) { // ESTUDIANTE
      // If no DNI from frontend, generate a placeholder based on timestamp to avoid unique conflict
      if (!finalDni) {
        finalDni = `TEMP_${Date.now().toString().slice(-8)}`;
      }
      
      const existingDni = await prisma.estudiante.findUnique({ where: { dni: finalDni } });
      if (existingDni) throw new Error('DNI already registered');
    } else if (id_usuario_tipo === 4) { // EMPRESA
      // If no RUC from frontend, generate a placeholder
      if (!finalRuc) {
        finalRuc = `TEMP_${Date.now().toString().slice(-11)}`;
      }
      
      const existingRuc = await prisma.empresa.findUnique({ where: { ruc: finalRuc } });
      if (existingRuc) throw new Error('RUC already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const estado_cuenta = 1; // Standard "Active" status

    // 3. Create User
    const user = await prisma.usuario.create({
      data: {
        username,
        password: hashedPassword,
        id_usuario_tipo,
        estado_cuenta,
      },
    });

    // 4. Handle profile creation with full data
    try {
      if (id_usuario_tipo === 3) { // ESTUDIANTE
        await prisma.estudiante.create({
          data: {
            id_usuario: user.id_usuario,
            dni: finalDni,
            nombres: userData.nombres || '',
            apellidos: userData.apellidos || '',
            carrera: userData.carrera || '',
            ciclo: userData.ciclo || '',
            correo_contacto: userData.correo_contacto || userData.email || username,
            telefono: userData.telefono || null,
            formacion: {
              create: {
                universidad_instituto: userData.universidad_instituto || "Universidad Peruana Unión",
                estado_estudio: userData.estado_estudio || "Cursando",
                sello_universidad: false
              }
            },
            puntos_ranking: 0
          }
        });
      } else if (id_usuario_tipo === 4) { // EMPRESA
        await prisma.empresa.create({
          data: {
            id_usuario: user.id_usuario,
            razon_social: userData.razon_social || '',
            ruc: finalRuc,
            logo_url: userData.logo_url || 'https://via.placeholder.com/150',
            rubro: userData.rubro || null,
            status: 'activo',
          }
        });
      }
    } catch (profileError) {
      await prisma.usuario.delete({ where: { id_usuario: user.id_usuario } });
      throw profileError;
    }

    return { id_usuario: user.id_usuario, username: user.username, id_usuario_tipo: user.id_usuario_tipo };
  }

  public async loginUser(credentials: any) {
    const username = credentials.username || credentials.email;
    const password = credentials.password;

    if (!username || !password) {
      throw new Error('Username (or Email) and password are required');
    }

    const user = await prisma.usuario.findFirst({ 
      where: { username },
      include: { usuarioTipo: true }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.estado_cuenta === -1) {
      throw new Error('User account is suspended');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { 
      user: { 
        id: user.id_usuario, 
        role: user.usuarioTipo.descripcion_tipo.toUpperCase() 
      } 
    };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });

    return {
      token,
      user: { 
        id: user.id_usuario, 
        email: user.username,
        username: user.username, 
        role: user.usuarioTipo.descripcion_tipo.toUpperCase() 
      }
    };
  }

  public async getUserById(userId: number) {
    const user = await prisma.usuario.findFirst({
      where: { id_usuario: userId },
      include: {
        usuarioTipo: { select: { descripcion_tipo: true } },
        estudianteProfile: true,
        empresaProfile: true
      },
    });

    if (!user) return null;

    return {
      id: user.id_usuario,
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.username,
      role: user.usuarioTipo.descripcion_tipo.toUpperCase(),
      id_usuario_tipo: user.id_usuario_tipo,
      estado_cuenta: user.estado_cuenta,
      profile: user.estudianteProfile || user.empresaProfile
    };
  }
}
