"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const result = await authService.registerUser(req.body);
            res.status(201).json({ status: 'success', message: 'User created successfully', data: result });
        }
        catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    }
    async login(req, res) {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json({ status: 'success', ...result });
        }
        catch (error) {
            res.status(401).json({ status: 'error', message: error.message });
        }
    }
    async getMe(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ status: 'error', message: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;
            const user = await authService.getUserById(userId);
            res.status(200).json({ status: 'success', data: user });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.AuthController = AuthController;
