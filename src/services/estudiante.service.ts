import { prisma } from '../config/prisma';

export class EstudianteService {
  public async getDashboardStats(userId: number) {
    const profile = await prisma.estudiante.findUnique({
      where: { id_usuario: userId },
      include: {
        _count: { select: { estudianteRetos: true } },
        estudianteRetos: {
          where: { estado_desarrollo: 'Aprobado' },
          include: { reto: { include: { nivel_dificultad: true } } }
        }
      }
    });

    if (!profile) throw new Error('Profile not found');

    const totalPracticeHours = profile.estudianteRetos.reduce((acc, er) => {
      return acc + (er.reto.nivel_dificultad?.horas_por_defecto || 0);
    }, 0);

    const totalPoints = profile.puntos_ranking || 0;
    const rank = await prisma.estudiante.count({
      where: { puntos_ranking: { gt: totalPoints } }
    }) + 1;

    return {
      points: totalPoints,
      rank,
      approvedChallengesCount: profile.estudianteRetos.length,
      totalPracticeHours,
      totalSubmissions: profile._count.estudianteRetos
    };
  }

  public async updateProfile(userId: number, profileData: any) {
    return prisma.estudiante.update({
      where: { id_usuario: userId },
      data: profileData
    });
  }

  public async getMySubmissions(userId: number) {
    const profile = await prisma.estudiante.findUnique({ where: { id_usuario: userId } });
    if (!profile) throw new Error('Profile not found');

    return prisma.estudianteReto.findMany({
      where: { id_estudiante: profile.id_estudiante },
      include: { reto: { select: { titulo: true, empresa: { select: { razon_social: true } } } } },
      orderBy: { fecha_inicio: 'desc' }
    });
  }

  public async getRanking(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      prisma.estudiante.count(),
      prisma.estudiante.findMany({
        orderBy: { puntos_ranking: 'desc' },
        skip,
        take: limit,
        include: {
          usuario: { select: { username: true } }
        }
      })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  public async submitChallenge(userId: number, submissionData: any) {
    const { id_reto, solucion_texto_url, contacto_networking, fecha_inicio, fecha_entrega, evidencias } = submissionData;

    const profile = await prisma.estudiante.findUnique({ where: { id_usuario: userId } });
    if (!profile) throw new Error('Profile not found');

    const [submission, postulacion] = await prisma.$transaction([
      prisma.estudianteReto.create({
        data: {
          id_estudiante: profile.id_estudiante,
          id_reto,
          solucion_texto_url,
          contacto_networking: !!contacto_networking,
          estado_desarrollo: 'Entregado',
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
          fecha_entrega: fecha_entrega ? new Date(fecha_entrega) : new Date()
        }
      }),
      prisma.postulacion.create({
        data: {
          id_estudiante: profile.id_estudiante,
          id_reto,
          repositorio_url: (solucion_texto_url || 'Postulación vía plataforma Certian').substring(0, 255),
          estado: 'pendiente',
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
          fecha_entrega: fecha_entrega ? new Date(fecha_entrega) : new Date()
        }
      })
    ]);

    // Create per-step evidence records
    if (evidencias && Array.isArray(evidencias) && evidencias.length > 0) {
      await prisma.pasoEvidencia.createMany({
        data: evidencias.map((ev: any) => ({
          id_estudiante_reto: submission.id_estudiante_reto,
          id_paso_reto: ev.id_paso_reto,
          url_evidencia: ev.url_evidencia || '',
          comentario: ev.comentario || null,
        }))
      });
    }

    return { submission, postulacion };
  }
}
