import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.get('/dashboard', authMiddleware, roleMiddleware(['ADMIN']), adminController.getDashboard);
router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), adminController.getUsers);
router.get('/users/:userId', authMiddleware, roleMiddleware(['ADMIN']), adminController.getUserById);
router.put('/users/:userId/status', authMiddleware, roleMiddleware(['ADMIN']), adminController.updateUserStatus);
router.put('/users/:userId/role', authMiddleware, roleMiddleware(['ADMIN']), adminController.updateUserRole);
router.delete('/users/:userId', authMiddleware, roleMiddleware(['ADMIN']), adminController.deleteUser);

// Master Data Management
router.post('/topics', authMiddleware, roleMiddleware(['ADMIN']), adminController.createTopic);
router.post('/skills', authMiddleware, roleMiddleware(['ADMIN']), adminController.createSkill);
router.get('/skills', authMiddleware, adminController.getSkills);

export default router;
