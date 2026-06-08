import { prisma } from '../config/prisma';

export class ChallengeService {
  public async getAllChallenges(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    const whereClause = {
      estado: 'abierto' as any,
      ...(search && { titulo: { contains: search, mode: 'insensitive' as any } })
    };

    const [total, data] = await Promise.all([
      prisma.reto.count({ where: whereClause }),
      prisma.reto.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          empresa: { select: { razon_social: true, logo_url: true } },
          tema: true,
          nivel_dificultad: true
        }
      })
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  public async getChallengeById(id: number) {
    return prisma.reto.findUnique({
      where: { id_reto: id },
      include: {
        empresa: { select: { razon_social: true, logo_url: true, rubro: true } },
        tema: true,
        nivel_dificultad: true
      }
    });
  }

  public async createChallenge(userId: number, challengeData: any) {
    const company = await prisma.empresa.findUnique({ where: { id_usuario: userId } });
    if (!company) throw new Error('Company not found');

    return prisma.reto.create({
      data: {
        id_empresa: company.id_empresa,
        id_tema: challengeData.id_tema,
        id_nivel_dificultad: challengeData.id_nivel_dificultad,
        titulo: challengeData.titulo,
        descripcion_problema: challengeData.descripcion_problema,
        requisitos_entrega: challengeData.requisitos_entrega,
        estado: 'abierto'
      }
    });
  }

  public async updateChallenge(id: number, userId: number, updateData: any) {
    const company = await prisma.empresa.findUnique({ where: { id_usuario: userId } });
    if (!company) throw new Error('Company not found');

    const challenge = await prisma.reto.findUnique({ where: { id_reto: id } });
    if (!challenge || challenge.id_empresa !== company.id_empresa) {
      throw new Error('Unauthorized or challenge not found');
    }

    return prisma.reto.update({
      where: { id_reto: id },
      data: updateData
    });
  }

  public async deleteChallenge(id: number, userId: number) {
    const company = await prisma.empresa.findUnique({ where: { id_usuario: userId } });
    if (!company) throw new Error('Company not found');

    const challenge = await prisma.reto.findUnique({ where: { id_reto: id } });
    if (!challenge || challenge.id_empresa !== company.id_empresa) {
      throw new Error('Unauthorized or challenge not found');
    }

    return prisma.reto.delete({ where: { id_reto: id } });
  }

  public async getTopics() {
    return prisma.tema.findMany();
  }

  public async getDifficultyLevels() {
    return prisma.nivelDificultad.findMany();
  }
}
