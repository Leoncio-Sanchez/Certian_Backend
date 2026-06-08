"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../config/prisma");
class AdminService {
    async getDashboardStats() {
        const totalUsers = await prisma_1.prisma.usuario.count();
        const totalEstudiantes = await prisma_1.prisma.usuario.count({ where: { id_usuario_tipo: 3 } });
        const totalEmpresas = await prisma_1.prisma.usuario.count({ where: { id_usuario_tipo: 4 } });
        const totalAdmins = await prisma_1.prisma.usuario.count({ where: { id_usuario_tipo: 2 } });
        const totalInvitados = await prisma_1.prisma.usuario.count({ where: { id_usuario_tipo: 1 } });
        const totalChallenges = await prisma_1.prisma.reto.count();
        const totalSubmissions = await prisma_1.prisma.postulacion.count();
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
    async getUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            prisma_1.prisma.usuario.count(),
            prisma_1.prisma.usuario.findMany({
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
    async getUserById(userId) {
        return prisma_1.prisma.usuario.findUnique({
            where: { id_usuario: userId },
            include: {
                usuarioTipo: true,
                estudianteProfile: true,
                empresaProfile: true,
            },
        });
    }
    async updateUserStatus(userId, estado_cuenta) {
        return prisma_1.prisma.usuario.update({
            where: { id_usuario: userId },
            data: { estado_cuenta },
        });
    }
    async updateUserRole(userId, id_usuario_tipo) {
        return prisma_1.prisma.usuario.update({
            where: { id_usuario: userId },
            data: { id_usuario_tipo },
        });
    }
    async deleteUser(userId) {
        return prisma_1.prisma.usuario.delete({
            where: { id_usuario: userId }
        });
    }
    // --- MASTER DATA MANAGEMENT ---
    async createTopic(data) {
        return prisma_1.prisma.tema.create({ data });
    }
    async updateTopic(id, data) {
        return prisma_1.prisma.tema.update({ where: { id_tema: id }, data });
    }
    async deleteTopic(id) {
        return prisma_1.prisma.tema.delete({ where: { id_tema: id } });
    }
    async createSkill(data) {
        return prisma_1.prisma.habilidad.create({ data });
    }
    async updateSkill(id, data) {
        return prisma_1.prisma.habilidad.update({ where: { id_habilidad: id }, data });
    }
    async deleteSkill(id) {
        return prisma_1.prisma.habilidad.delete({ where: { id_habilidad: id } });
    }
    async getSkills() {
        return prisma_1.prisma.habilidad.findMany();
    }
}
exports.AdminService = AdminService;
