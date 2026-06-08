"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitadoService = void 0;
const prisma_1 = require("../config/prisma");
class InvitadoService {
    async getPublicChallenges() {
        return prisma_1.prisma.reto.findMany({
            where: { estado: 'abierto' },
            take: 10,
            include: {
                empresa: {
                    select: { razon_social: true, logo_url: true }
                }
            }
        });
    }
    async getAliasedCompanies() {
        return prisma_1.prisma.empresa.findMany({
            take: 5,
            select: {
                razon_social: true,
                logo_url: true,
                rubro: true
            }
        });
    }
}
exports.InvitadoService = InvitadoService;
