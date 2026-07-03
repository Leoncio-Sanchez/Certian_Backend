"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estudiante_controller_1 = require("../controllers/estudiante.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const estudianteController = new estudiante_controller_1.EstudianteController();
router.get('/dashboard', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ESTUDIANTE']), estudianteController.getDashboard);
router.put('/profile', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ESTUDIANTE']), estudianteController.updateProfile);
router.get('/my-submissions', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ESTUDIANTE']), estudianteController.getMySubmissions);
router.get('/ranking', auth_middleware_1.authMiddleware, estudianteController.getRanking);
// Submit challenge with evidence files (multipart/form-data)
router.post('/submit', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ESTUDIANTE']), upload_middleware_1.uploadEvidence.fields([
    { name: 'evidencia', maxCount: 5 }, // up to 5 evidence files
    { name: 'repositorio', maxCount: 1 }, // optional repo file
]), estudianteController.submitChallenge);
// Submit challenge without files (JSON body)
router.post('/submit-json', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['ESTUDIANTE']), estudianteController.submitChallenge);
exports.default = router;
