import { Router } from 'express';
import { InvitadoController } from '../controllers/invitado.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const invitadoController = new InvitadoController();

// Only registered "INVITADO" users can access this module
router.get('/welcome', authMiddleware, roleMiddleware(['INVITADO']), invitadoController.getWelcome);
router.get('/public-challenges', authMiddleware, roleMiddleware(['INVITADO']), invitadoController.getPublicChallenges);

export default router;
