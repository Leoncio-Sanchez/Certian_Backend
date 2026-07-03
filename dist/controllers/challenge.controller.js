"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeController = void 0;
const challenge_service_1 = require("../services/challenge.service");
const storage_service_1 = require("../services/storage.service");
const challengeService = new challenge_service_1.ChallengeService();
const storageService = new storage_service_1.StorageService();
class ChallengeController {
    async getChallenges(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || '';
            const challenges = await challengeService.getAllChallenges(page, limit, search);
            res.status(200).json({ status: 'success', ...challenges });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getChallengeById(req, res) {
        try {
            const id = Number(req.params.id);
            const challenge = await challengeService.getChallengeById(id);
            if (!challenge) {
                res.status(404).json({ status: 'error', message: 'Challenge not found' });
                return;
            }
            res.status(200).json({ status: 'success', data: challenge });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async createChallenge(req, res) {
        try {
            const files = req.files;
            let imagen_url = '';
            let documento_url = '';
            if (files?.['imagen']) {
                imagen_url = await storageService.uploadFile(files['imagen'][0], 'challenges/images');
            }
            if (files?.['documento']) {
                documento_url = await storageService.uploadFile(files['documento'][0], 'challenges/docs');
            }
            // Parse pasos if sent as JSON string (multipart/form-data serializes arrays as strings)
            let pasos = req.body.pasos;
            if (typeof pasos === 'string') {
                try {
                    pasos = JSON.parse(pasos);
                }
                catch {
                    pasos = [];
                }
            }
            // Build guia_pasos as JSON fallback for backward compatibility
            const guia_pasos = Array.isArray(pasos) && pasos.length > 0
                ? JSON.stringify(pasos.map((p) => ({ title: p.titulo || p.title, description: p.descripcion || p.description })))
                : '';
            const challengeData = {
                ...req.body,
                id_tema: Number(req.body.id_tema),
                id_nivel_dificultad: Number(req.body.id_nivel_dificultad),
                imagen_url,
                documento_url,
                guia_pasos: req.body.guia_pasos || guia_pasos,
                pasos
            };
            const newChallenge = await challengeService.createChallenge(req.user.id, challengeData);
            res.status(201).json({ status: 'success', data: newChallenge });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async updateChallenge(req, res) {
        try {
            const id = Number(req.params.id);
            // Parse pasos if sent as JSON string
            let pasos = req.body.pasos;
            if (typeof pasos === 'string') {
                try {
                    pasos = JSON.parse(pasos);
                }
                catch {
                    pasos = undefined;
                }
            }
            const updateData = {
                ...req.body,
                pasos
            };
            const updatedChallenge = await challengeService.updateChallenge(id, req.user.id, updateData);
            res.status(200).json({ status: 'success', data: updatedChallenge });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async deleteChallenge(req, res) {
        try {
            const id = Number(req.params.id);
            await challengeService.deleteChallenge(id, req.user.id);
            res.status(200).json({ status: 'success', message: 'Challenge deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getTopics(req, res) {
        try {
            const topics = await challengeService.getTopics();
            res.status(200).json({ status: 'success', data: topics });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getDifficultyLevels(req, res) {
        try {
            const levels = await challengeService.getDifficultyLevels();
            res.status(200).json({ status: 'success', data: levels });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async createTopic(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre) {
                res.status(400).json({ status: 'error', message: 'Topic name is required' });
                return;
            }
            const topic = await challengeService.createTopic(nombre, descripcion || '');
            res.status(201).json({ status: 'success', data: topic });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.ChallengeController = ChallengeController;
