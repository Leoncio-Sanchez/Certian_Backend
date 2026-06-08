import { prisma } from '../config/prisma';

export class InvitadoService {
  public async getPublicChallenges() {
    return prisma.reto.findMany({
      where: { estado: 'abierto' },
      take: 10,
      include: {
        empresa: {
          select: { razon_social: true, logo_url: true }
        }
      }
    });
  }

  public async getAliasedCompanies() {
    return prisma.empresa.findMany({
      take: 5,
      select: {
        razon_social: true,
        logo_url: true,
        rubro: true
      }
    });
  }
}
