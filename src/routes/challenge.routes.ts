import { Router } from 'express';
import { ChallengeController } from '../controllers/challenge.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const challengeController = new ChallengeController();

router.get('/', challengeController.getChallenges);
router.get('/topics', challengeController.getTopics);
router.get('/difficulty-levels', challengeController.getDifficultyLevels);
router.get('/:id', challengeController.getChallengeById);
router.post('/', authMiddleware, roleMiddleware(['EMPRESA']), challengeController.createChallenge);
router.put('/:id', authMiddleware, roleMiddleware(['EMPRESA']), challengeController.updateChallenge);
router.delete('/:id', authMiddleware, roleMiddleware(['EMPRESA', 'ADMIN']), challengeController.deleteChallenge);

export default router;
