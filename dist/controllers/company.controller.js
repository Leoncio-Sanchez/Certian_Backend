"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const company_service_1 = require("../services/company.service");
const storage_service_1 = require("../services/storage.service");
const companyService = new company_service_1.CompanyService();
const storageService = new storage_service_1.StorageService();
class CompanyController {
    async getDashboard(req, res) {
        try {
            const stats = await companyService.getDashboardStats(req.user.id);
            res.status(200).json({ status: 'success', data: stats });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async uploadLogo(req, res) {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).json({ status: 'error', message: 'No se envió ninguna imagen' });
                return;
            }
            const logoUrl = await storageService.uploadFile(file, 'companies/logos');
            await companyService.updateProfile(req.user.id, { logo_url: logoUrl });
            res.status(200).json({ status: 'success', data: { logo_url: logoUrl } });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const profile = await companyService.updateProfile(req.user.id, req.body);
            res.status(200).json({ status: 'success', data: profile });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getMyChallenges(req, res) {
        try {
            const challenges = await companyService.getMyChallenges(req.user.id);
            res.status(200).json({ status: 'success', data: challenges });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getSubmissions(req, res) {
        try {
            const submissions = await companyService.getSubmissions(req.user.id);
            res.status(200).json({ status: 'success', data: submissions });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async gradeSubmission(req, res) {
        try {
            const id = Number(req.params.id);
            const submission = await companyService.gradeSubmission(id, req.body);
            res.status(200).json({ status: 'success', data: submission });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async searchTalents(req, res) {
        try {
            const talents = await companyService.searchTalents(req.query);
            res.status(200).json({ status: 'success', data: talents });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.CompanyController = CompanyController;
