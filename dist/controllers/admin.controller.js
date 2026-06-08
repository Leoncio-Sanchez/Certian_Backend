"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const adminService = new admin_service_1.AdminService();
class AdminController {
    async getDashboard(req, res) {
        try {
            const stats = await adminService.getDashboardStats();
            res.status(200).json({ status: 'success', data: stats });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getUsers(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const users = await adminService.getUsers(page, limit);
            res.status(200).json({ status: 'success', ...users });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const userId = Number(req.params.userId);
            const user = await adminService.getUserById(userId);
            if (!user)
                return res.status(404).json({ status: 'error', message: 'User not found' });
            res.status(200).json({ status: 'success', data: user });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async updateUserStatus(req, res) {
        try {
            const userId = Number(req.params.userId);
            const { estado_cuenta } = req.body;
            const updatedUser = await adminService.updateUserStatus(userId, estado_cuenta);
            res.status(200).json({ status: 'success', data: updatedUser });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async updateUserRole(req, res) {
        try {
            const userId = Number(req.params.userId);
            const { id_usuario_tipo } = req.body;
            const updatedUser = await adminService.updateUserRole(userId, id_usuario_tipo);
            res.status(200).json({ status: 'success', data: updatedUser });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = Number(req.params.userId);
            await adminService.deleteUser(userId);
            res.status(200).json({ status: 'success', message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    // --- MASTER DATA ---
    async createTopic(req, res) {
        try {
            const topic = await adminService.createTopic(req.body);
            res.status(201).json({ status: 'success', data: topic });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async createSkill(req, res) {
        try {
            const skill = await adminService.createSkill(req.body);
            res.status(201).json({ status: 'success', data: skill });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getSkills(req, res) {
        try {
            const skills = await adminService.getSkills();
            res.status(200).json({ status: 'success', data: skills });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.AdminController = AdminController;
