"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudianteController = void 0;
const estudiante_service_1 = require("../services/estudiante.service");
const storage_service_1 = require("../services/storage.service");
const estudianteService = new estudiante_service_1.EstudianteService();
const storageService = new storage_service_1.StorageService();
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
            const files = req.files;
            const body = req.body;
            // Upload evidence files to R2 if present
            let solucion_texto_url = body.solucion_texto_url || '';
            let repositorio_url = body.repositorio_url || '';
            if (files?.['evidencia']) {
                const urls = [];
                for (const file of files['evidencia']) {
                    const url = await storageService.uploadFile(file, `estudiantes/evidencias/${req.user.id}`);
                    urls.push(url);
                }
                solucion_texto_url = urls.join('\n'); // Join multiple file URLs with newlines
            }
            if (files?.['repositorio']) {
                repositorio_url = await storageService.uploadFile(files['repositorio'][0], `estudiantes/repositorios/${req.user.id}`);
            }
            const submissionData = {
                ...body,
                id_reto: Number(body.id_reto),
                solucion_texto_url: solucion_texto_url || body.solucion_texto_url || repositorio_url || '',
                repositorio_url: repositorio_url || body.repositorio_url || '',
                contacto_networking: body.contacto_networking === 'true' || body.contacto_networking === true,
            };
            const submission = await estudianteService.submitChallenge(req.user.id, submissionData);
            res.status(201).json({ status: 'success', data: submission });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.EstudianteController = EstudianteController;
