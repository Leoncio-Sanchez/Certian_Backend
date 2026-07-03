"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const prisma_1 = require("../config/prisma");
class CompanyService {
    async getDashboardStats(userId) {
        const company = await prisma_1.prisma.empresa.findUnique({
            where: { id_usuario: userId },
            include: {
                retos: {
                    include: {
                        _count: { select: { postulaciones: true } }
                    }
                }
            }
        });
        if (!company)
            throw new Error('Company not found');
        const totalChallenges = company.retos.length;
        const totalSubmissions = company.retos.reduce((acc, r) => acc + r._count.postulaciones, 0);
        const pendingSubmissions = await prisma_1.prisma.postulacion.count({
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
    async updateProfile(userId, profileData) {
        return prisma_1.prisma.empresa.update({
            where: { id_usuario: userId },
            data: profileData
        });
    }
    async getMyChallenges(userId) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        return prisma_1.prisma.reto.findMany({
            where: { id_empresa: company.id_empresa },
            include: { tema: true, nivel_dificultad: true, pasos: { orderBy: { orden: 'asc' } } },
            orderBy: { created_at: 'desc' }
        });
    }
    async searchTalents(filters) {
        const { carrera, ciclo, minPoints } = filters;
        return prisma_1.prisma.estudiante.findMany({
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
    async getSubmissions(userId) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        return prisma_1.prisma.postulacion.findMany({
            where: { reto: { id_empresa: company.id_empresa } },
            include: {
                estudiante: { select: { nombres: true, apellidos: true, carrera: true } },
                reto: { select: { titulo: true } }
            },
            orderBy: { fecha_inicio: 'desc' }
        });
    }
    async gradeSubmission(submissionId, gradeData) {
        const { estado, feedback_tecnico, score_tech, pointsReward } = gradeData;
        const submission = await prisma_1.prisma.postulacion.update({
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
            await prisma_1.prisma.estudiante.update({
                where: { id_estudiante: submission.id_estudiante },
                data: {
                    puntos_ranking: { increment: pointsReward }
                }
            });
        }
        return submission;
    }
    async initiateNetworking(userId, networkingData) {
        const company = await prisma_1.prisma.empresa.findUnique({ where: { id_usuario: userId } });
        if (!company)
            throw new Error('Company not found');
        return prisma_1.prisma.interaccionNetworking.create({
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
exports.CompanyService = CompanyService;
