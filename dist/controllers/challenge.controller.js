"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeController = void 0;
const challenge_service_1 = require("../services/challenge.service");
const challengeService = new challenge_service_1.ChallengeService();
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
            const newChallenge = await challengeService.createChallenge(req.user.id, req.body);
            res.status(201).json({ status: 'success', data: newChallenge });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async updateChallenge(req, res) {
        try {
            const id = Number(req.params.id);
            const updatedChallenge = await challengeService.updateChallenge(id, req.user.id, req.body);
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
}
exports.ChallengeController = ChallengeController;
