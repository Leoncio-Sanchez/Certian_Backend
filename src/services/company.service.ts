import { prisma } from '../config/prisma';

export class CompanyService {
  public async getDashboardStats(userId: number) {
    const company = await prisma.empresa.findUnique({
      where: { id_usuario: userId },
      include: {
        retos: {
          include: {
            _count: { select: { postulaciones: true } }
          }
        }
      }
    });

    if (!company) throw new Error('Company not found');

    const totalChallenges = company.retos.length;
    const totalSubmissions = company.retos.reduce((acc, r) => acc + r._count.postulaciones, 0);
    const pendingSubmissions = await prisma.postulacion.count({
      where: {
        reto: { id_empresa: company.id_empresa },
        estado: 'pendiente'
      }
    });

    return {
      totalChallenges,
      totalSubmissions,
      pendingSubmissions,
      challenges: company.retos
    };
  }

  public async updateProfile(userId: number, profileData: any) {
    return prisma.empresa.update({
      where: { id_usuario: userId },
      data: profileData
    });
  }

  public async getMyChallenges(userId: number) {
    const company = await prisma.empresa.findUnique({ where: { id_usuario: userId } });
    if (!company) throw new Error('Company not found');

    return prisma.reto.findMany({
      where: { id_empresa: company.id_empresa },
      include: { tema: true, nivel_dificultad: true, pasos: { orderBy: { orden: 'asc' } } },
      orderBy: { created_at: 'desc' }
    });
  }

  public async searchTalents(filters: any) {
    const { carrera, ciclo, minPoints } = filters;

    return prisma.estudiante.findMany({
      where: {
        carrera: carrera ? { contains: carrera, mode: 'insensitive' } : undefined,
        ciclo: ciclo ? { equals: ciclo } : undefined,
        puntos_ranking: minPoints ? { gte: parseInt(minPoints) } : undefined,
      },
      include: {
        usuario: { select: { username: true } },
        formacion: true,
        habilidades: { include: { habilidad: true } }
      }
    });
  }

  public async getSubmissions(userId: number) {
    const company = await prisma.empresa.findUnique({ where: { id_usuario: userId } });
    if (!company) throw new Error('Company not found');

    return prisma.postulacion.findMany({
      where: { reto: { id_empresa: company.id_empresa } },
      include: {
        estudiante: { select: { nombres: true, apellidos: true, carrera: true } },
        reto: { select: { titulo: true } }
      },
      orderBy: { fecha_inicio: 'desc' }
    });
  }

  public async gradeSubmission(submissionId: number, gradeData: any) {
    const { estado, feedback_tecnico, score_tech, pointsReward } = gradeData;

    const submission = await prisma.postulacion.update({
      where: { id_postulacion: submissionId },
      data: {
        estado,
        feedback_tecnico,
        score_tech,
        fecha_entrega: new Date(),
      },
      include: { estudiante: true }
    });

    if (estado === 'aprobado' && pointsReward) {
      await prisma.estudiante.update({
        where: { id_estudiante: submission.id_estudiante },
        data: {
          puntos_ranking: { increment: pointsReward }
        }
      });
    }

    return submission;
  }

  public async initiateNetworking(userId: number, networkingData: any) {
    const company = await prisma.empresa.findUnique({ where: { id_usuario: userId } });
    if (!company) throw new Error('Company not found');

    return prisma.interaccionNetworking.create({
      data: {
        id_empresa: company.id_empresa,
        id_estudiante: networkingData.id_estudiante,
        tipo_accion: networkingData.tipo_accion,
        mensaje_convocatoria: networkingData.mensaje_convocatoria,
        estado_proceso: 'pendiente'
      }
    });
  }
}
