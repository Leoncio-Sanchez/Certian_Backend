"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const challenge_controller_1 = require("../controllers/challenge.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const challengeController = new challenge_controller_1.ChallengeController();
router.get('/', challengeController.getChallenges);
router.get('/topics', challengeController.getTopics);
router.get('/difficulty-levels', challengeController.getDifficultyLevels);
router.get('/:id', challengeController.getChallengeById);
// Create challenge (JSON body, no files required)
router.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['EMPRESA']), challengeController.createChallenge);
// Create challenge with files (multipart/form-data)
router.post('/upload', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['EMPRESA']), upload_middleware_1.upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'documento', maxCount: 1 }
]), challengeController.createChallenge);
// Create topic
router.post('/topics', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['EMPRESA', 'ADMIN']), challengeController.createTopic);
router.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['EMPRESA']), challengeController.updateChallenge);
router.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['EMPRESA', 'ADMIN']), challengeController.deleteChallenge);
exports.default = router;
