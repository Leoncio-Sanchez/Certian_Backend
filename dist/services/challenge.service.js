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
                    nivel_dificultad: true,
                    pasos: { orderBy: { orden: 'asc' } }
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
                nivel_dificultad: true,
                pasos: { orderBy: { orden: 'asc' } }
            }
        });
    }
    async createChallenge(userId, challengeData) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        const { pasos, ...retoFields } = challengeData;
        const reto = await prisma_1.prisma.reto.create({
            data: {
                id_empresa: company.id_empresa,
                id_tema: retoFields.id_tema,
                id_nivel_dificultad: retoFields.id_nivel_dificultad,
                titulo: retoFields.titulo,
                descripcion_problema: retoFields.descripcion_problema,
                requisitos_entrega: retoFields.requisitos_entrega,
                guia_pasos: retoFields.guia_pasos || null,
                imagen_url: retoFields.imagen_url || null,
                documento_url: retoFields.documento_url || null,
                fecha_inicio: retoFields.fecha_inicio ? new Date(retoFields.fecha_inicio) : null,
                fecha_limite: retoFields.fecha_limite ? new Date(retoFields.fecha_limite) : null,
                estado: retoFields.estado || 'abierto',
                pasos: pasos && Array.isArray(pasos) ? {
                    create: pasos.map((p, index) => ({
                        orden: p.orden ?? index + 1,
                        titulo: p.titulo || p.title || '',
                        descripcion: p.descripcion || p.description || ''
                    }))
                } : undefined
            },
            include: { pasos: { orderBy: { orden: 'asc' } } }
        });
        return reto;
    }
    async updateChallenge(id, userId, updateData) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        const challenge = await prisma_1.prisma.reto.findUnique({ where: { id_reto: id } });
        if (!challenge || challenge.id_empresa !== company.id_empresa) {
            throw new Error('Unauthorized or challenge not found');
        }
        const { pasos, id_tema, id_nivel_dificultad, id_empresa, ...retoFields } = updateData;
        // Convert date strings to Date objects
        if (retoFields.fecha_inicio && typeof retoFields.fecha_inicio === 'string') {
            retoFields.fecha_inicio = new Date(retoFields.fecha_inicio);
        }
        if (retoFields.fecha_limite && typeof retoFields.fecha_limite === 'string') {
            retoFields.fecha_limite = new Date(retoFields.fecha_limite);
        }
        // If pasos are provided, replace all existing steps
        if (pasos !== undefined) {
            await prisma_1.prisma.pasoReto.deleteMany({ where: { id_reto: id } });
            if (Array.isArray(pasos) && pasos.length > 0) {
                await prisma_1.prisma.pasoReto.createMany({
                    data: pasos.map((p, index) => ({
                        id_reto: id,
                        orden: p.orden ?? index + 1,
                        titulo: p.titulo || p.title || '',
                        descripcion: p.descripcion || p.description || ''
                    }))
                });
            }
        }
        return prisma_1.prisma.reto.update({
            where: { id_reto: id },
            data: {
                ...retoFields,
                ...(id_tema && { tema: { connect: { id_tema: Number(id_tema) } } }),
                ...(id_nivel_dificultad && { nivel_dificultad: { connect: { id_nivel_dificultad: Number(id_nivel_dificultad) } } }),
            },
            include: { pasos: { orderBy: { orden: 'asc' } } }
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
        // Cascade delete will handle pasos automatically
        return prisma_1.prisma.reto.delete({ where: { id_reto: id } });
    }
    async getTopics() {
        return prisma_1.prisma.tema.findMany();
    }
    async getDifficultyLevels() {
        return prisma_1.prisma.nivelDificultad.findMany();
    }
    async createTopic(nombre, descripcion) {
        const existing = await prisma_1.prisma.tema.findUnique({ where: { nombre } });
        if (existing)
            throw new Error('Topic already exists');
        return prisma_1.prisma.tema.create({ data: { nombre, descripcion } });
    }
}
exports.ChallengeService = ChallengeService;
