"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invitado_controller_1 = require("../controllers/invitado.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const invitadoController = new invitado_controller_1.InvitadoController();
// Only registered "INVITADO" users can access this module
router.get('/welcome', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['INVITADO']), invitadoController.getWelcome);
router.get('/public-challenges', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)(['INVITADO']), invitadoController.getPublicChallenges);
exports.default = router;
