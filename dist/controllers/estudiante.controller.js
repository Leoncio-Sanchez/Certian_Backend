"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudianteController = void 0;
const estudiante_service_1 = require("../services/estudiante.service");
const estudianteService = new estudiante_service_1.EstudianteService();
class EstudianteController {
    async getDashboard(req, res) {
        try {
            const stats = await estudianteService.getDashboardStats(req.user.id);
            res.status(200).json({ status: 'success', data: stats });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const profile = await estudianteService.updateProfile(req.user.id, req.body);
            res.status(200).json({ status: 'success', data: profile });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getMySubmissions(req, res) {
        try {
            const submissions = await estudianteService.getMySubmissions(req.user.id);
            res.status(200).json({ status: 'success', data: submissions });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getRanking(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;
            const ranking = await estudianteService.getRanking(page, limit);
            res.status(200).json({ status: 'success', ...ranking });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async submitChallenge(req, res) {
        try {
            const submission = await estudianteService.submitChallenge(req.user.id, req.body);
            res.status(201).json({ status: 'success', data: submission });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.EstudianteController = EstudianteController;
