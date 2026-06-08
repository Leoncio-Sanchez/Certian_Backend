import { Router } from 'express';
import { EstudianteController } from '../controllers/estudiante.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const estudianteController = new EstudianteController();

router.get('/dashboard', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.getDashboard);
router.put('/profile', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.updateProfile);
router.get('/my-submissions', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.getMySubmissions);
router.get('/ranking', authMiddleware, estudianteController.getRanking);
router.post('/submit', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.submitChallenge);

// Profile detail routes
// (Deleting the new ones I added)

export default router;
