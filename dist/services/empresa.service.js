"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const prisma_1 = require("../config/prisma");
class EmpresaService {
    async getDashboardStats(userId) {
        const company = await prisma_1.prisma.companyProfile.findUnique({
            where: { userId },
            include: {
                challenges: {
                    include: {
                        _count: { select: { submissions: true } }
                    }
                }
            }
        });
        if (!company)
            throw new Error('Company not found');
        const totalChallenges = company.challenges.length;
        const totalSubmissions = company.challenges.reduce((acc, c) => acc + c._count.submissions, 0);
        const pendingSubmissions = await prisma_1.prisma.evaluationSubmission.count({
            where: {
                challenge: { companyId: company.id },
                status: 'pending'
            }
        });
        return {
            totalChallenges,
            totalSubmissions,
            pendingSubmissions,
            challenges: company.challenges
        };
    }
    async searchTalents(filters) {
        const { techStack, softSkills, career, minPoints } = filters;
        return prisma_1.prisma.estudianteProfile.findMany({
            where: {
                career: career ? { contains: career, mode: 'insensitive' } : undefined,
                points: minPoints ? { gte: parseInt(minPoints) } : undefined,
                techStack: techStack ? { hasSome: techStack } : undefined,
                softSkills: softSkills ? { hasSome: softSkills } : undefined,
            },
            include: {
                user: { select: { name: true, avatar: true, email: true } }
            }
        });
    }
    async getSubmissions(userId) {
        const company = await prisma_1.prisma.companyProfile.findUnique({ where: { userId } });
        if (!company)
            throw new Error('Company not found');
        return prisma_1.prisma.evaluationSubmission.findMany({
            where: { challenge: { companyId: company.id } },
            include: {
                candidate: { include: { user: { select: { name: true, avatar: true } } } },
                challenge: { select: { title: true } }
            },
            orderBy: { submissionDate: 'desc' }
        });
    }
    async gradeSubmission(submissionId, gradeData) {
        const { status, feedback, rubricScore, pointsReward } = gradeData;
        const submission = await prisma_1.prisma.evaluationSubmission.update({
            where: { id: submissionId },
            data: {
                status,
                feedback,
                rubricScore
            },
            include: { candidate: true }
        });
        if (status === 'approved' && pointsReward) {
            await prisma_1.prisma.estudianteProfile.update({
                where: { id: submission.candidateId },
                data: {
                    points: { increment: pointsReward }
                }
            });
        }
        return submission;
    }
}
exports.EmpresaService = EmpresaService;
