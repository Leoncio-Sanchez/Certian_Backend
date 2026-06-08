import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const companyController = new CompanyController();

router.get('/dashboard', authMiddleware, roleMiddleware(['EMPRESA']), companyController.getDashboard);
router.put('/profile', authMiddleware, roleMiddleware(['EMPRESA']), companyController.updateProfile);
router.get('/my-challenges', authMiddleware, roleMiddleware(['EMPRESA']), companyController.getMyChallenges);
router.get('/submissions', authMiddleware, roleMiddleware(['EMPRESA']), companyController.getSubmissions);
router.put('/submissions/:id/grade', authMiddleware, roleMiddleware(['EMPRESA']), companyController.gradeSubmission);
router.get('/talents', authMiddleware, roleMiddleware(['EMPRESA']), companyController.searchTalents);

export default router;
