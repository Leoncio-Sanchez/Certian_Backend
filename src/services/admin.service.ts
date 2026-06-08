import { prisma } from '../config/prisma';

export class AdminService {
  public async getDashboardStats() {
    const totalUsers = await prisma.usuario.count();
    const totalEstudiantes = await prisma.usuario.count({ where: { id_usuario_tipo: 3 } });
    const totalEmpresas = await prisma.usuario.count({ where: { id_usuario_tipo: 4 } });
    const totalAdmins = await prisma.usuario.count({ where: { id_usuario_tipo: 2 } });
    const totalInvitados = await prisma.usuario.count({ where: { id_usuario_tipo: 1 } });
    const totalChallenges = await prisma.reto.count();
    const totalSubmissions = await prisma.postulacion.count();

    return {
      totalUsers,
      totalEstudiantes,
      totalEmpresas,
      totalAdmins,
      totalInvitados,
      totalChallenges,
      totalSubmissions,
    };
  }

  public async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.findMany({
        skip,
        take: limit,
        include: {
          usuarioTipo: true,
          estudianteProfile: true,
          empresaProfile: true,
        },
      })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  public async getUserById(userId: number) {
    return prisma.usuario.findUnique({
      where: { id_usuario: userId },
      include: {
        usuarioTipo: true,
        estudianteProfile: true,
        empresaProfile: true,
      },
    });
  }

  public async updateUserStatus(userId: number, estado_cuenta: number) {
    return prisma.usuario.update({
      where: { id_usuario: userId },
      data: { estado_cuenta },
    });
  }

  public async updateUserRole(userId: number, id_usuario_tipo: number) {
    return prisma.usuario.update({
      where: { id_usuario: userId },
      data: { id_usuario_tipo },
    });
  }

  public async deleteUser(userId: number) {
    return prisma.usuario.delete({
      where: { id_usuario: userId }
    });
  }

  // --- MASTER DATA MANAGEMENT ---
  public async createTopic(data: any) {
    return prisma.tema.create({ data });
  }
  public async updateTopic(id: number, data: any) {
    return prisma.tema.update({ where: { id_tema: id }, data });
  }
  public async deleteTopic(id: number) {
    return prisma.tema.delete({ where: { id_tema: id } });
  }

  public async createSkill(data: any) {
    return prisma.habilidad.create({ data });
  }
  public async updateSkill(id: number, data: any) {
    return prisma.habilidad.update({ where: { id_habilidad: id }, data });
  }
  public async deleteSkill(id: number) {
    return prisma.habilidad.delete({ where: { id_habilidad: id } });
  }
  public async getSkills() {
    return prisma.habilidad.findMany();
  }
}
