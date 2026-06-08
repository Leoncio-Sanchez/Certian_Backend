"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeService = void 0;
const prisma_1 = require("../config/prisma");
class ChallengeService {
    async getAllChallenges(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = {
            estado: 'abierto',
            ...(search && { titulo: { contains: search, mode: 'insensitive' } })
        };
        const [total, data] = await Promise.all([
            prisma_1.prisma.reto.count({ where: whereClause }),
            prisma_1.prisma.reto.findMany({
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
    async getChallengeById(id) {
        return prisma_1.prisma.reto.findUnique({
            where: { id_reto: id },
            include: {
                empresa: { select: { razon_social: true, logo_url: true, rubro: true } },
                tema: true,
                nivel_dificultad: true
            }
        });
    }
    async createChallenge(userId, challengeData) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        return prisma_1.prisma.reto.create({
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
    async updateChallenge(id, userId, updateData) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        const challenge = await prisma_1.prisma.reto.findUnique({ where: { id_reto: id } });
        if (!challenge || challenge.id_empresa !== company.id_empresa) {
            throw new Error('Unauthorized or challenge not found');
        }
        return prisma_1.prisma.reto.update({
            where: { id_reto: id },
            data: updateData
        });
    }
    async deleteChallenge(id, userId) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        const challenge = await prisma_1.prisma.reto.findUnique({ where: { id_reto: id } });
        if (!challenge || challenge.id_empresa !== company.id_empresa) {
            throw new Error('Unauthorized or challenge not found');
        }
        return prisma_1.prisma.reto.delete({ where: { id_reto: id } });
    }
    async getTopics() {
        return prisma_1.prisma.tema.findMany();
    }
    async getDifficultyLevels() {
        return prisma_1.prisma.nivelDificultad.findMany();
    }
}
exports.ChallengeService = ChallengeService;
