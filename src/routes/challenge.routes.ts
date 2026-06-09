import { Router } from 'express';
import { ChallengeController } from '../controllers/challenge.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();
const challengeController = new ChallengeController();

router.get('/', challengeController.getChallenges);
router.get('/topics', challengeController.getTopics);
router.get('/difficulty-levels', challengeController.getDifficultyLevels);
router.get('/:id', challengeController.getChallengeById);

router.post(
  '/', 
  authMiddleware, 
  roleMiddleware(['EMPRESA']), 
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'documento', maxCount: 1 }
  ]),
  challengeController.createChallenge
);

router.put('/:id', authMiddleware, roleMiddleware(['EMPRESA']), challengeController.updateChallenge);
router.delete('/:id', authMiddleware, roleMiddleware(['EMPRESA', 'ADMIN']), challengeController.deleteChallenge);

export default router;
