"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.get('/dashboard', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.getDashboard);
router.get('/users', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.getUsers);
router.get('/users/:userId', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.getUserById);
router.put('/users/:userId/status', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.updateUserStatus);
router.put('/users/:userId/role', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.updateUserRole);
router.delete('/users/:userId', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.deleteUser);
// Master Data Management
router.post('/topics', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.createTopic);
router.post('/skills', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ADMIN']), adminController.createSkill);
router.get('/skills', auth_middleware_1.authMiddleware, adminController.getSkills);
exports.default = router;
