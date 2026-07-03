import { Router } from 'express';
import { EstudianteController } from '../controllers/estudiante.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { uploadEvidence } from '../middlewares/upload.middleware';

const router = Router();
const estudianteController = new EstudianteController();

router.get('/dashboard', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.getDashboard);
router.put('/profile', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.updateProfile);
router.get('/my-submissions', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.getMySubmissions);
router.get('/ranking', authMiddleware, estudianteController.getRanking);

// Submit challenge with evidence files (multipart/form-data)
router.post(
  '/submit',
  authMiddleware,
  roleMiddleware(['ESTUDIANTE']),
  uploadEvidence.fields([
    { name: 'evidencia', maxCount: 5 },   // up to 5 evidence files
    { name: 'repositorio', maxCount: 1 },  // optional repo file
  ]),
  estudianteController.submitChallenge
);

// Submit challenge without files (JSON body)
router.post('/submit-json', authMiddleware, roleMiddleware(['ESTUDIANTE']), estudianteController.submitChallenge);

export default router;
