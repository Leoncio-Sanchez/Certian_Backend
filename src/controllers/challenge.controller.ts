import { Request, Response } from 'express';
import { ChallengeService } from '../services/challenge.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const challengeService = new ChallengeService();

export class ChallengeController {
  public async getChallenges(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string || '';
      const challenges = await challengeService.getAllChallenges(page, limit, search);
      res.status(200).json({ status: 'success', ...challenges });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getChallengeById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const challenge = await challengeService.getChallengeById(id);
      if (!challenge) {
        res.status(404).json({ status: 'error', message: 'Challenge not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: challenge });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async createChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const newChallenge = await challengeService.createChallenge(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: newChallenge });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async updateChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updatedChallenge = await challengeService.updateChallenge(id, req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: updatedChallenge });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async deleteChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await challengeService.deleteChallenge(id, req.user!.id);
      res.status(200).json({ status: 'success', message: 'Challenge deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getTopics(req: Request, res: Response) {
    try {
      const topics = await challengeService.getTopics();
      res.status(200).json({ status: 'success', data: topics });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getDifficultyLevels(req: Request, res: Response) {
    try {
      const levels = await challengeService.getDifficultyLevels();
      res.status(200).json({ status: 'success', data: levels });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
