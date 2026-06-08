import { Request, Response } from 'express';
import { EstudianteService } from '../services/estudiante.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const estudianteService = new EstudianteService();

export class EstudianteController {
  public async getDashboard(req: AuthRequest, res: Response) {
    try {
      const stats = await estudianteService.getDashboardStats(req.user!.id);
      res.status(200).json({ status: 'success', data: stats });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async updateProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await estudianteService.updateProfile(req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getMySubmissions(req: AuthRequest, res: Response) {
    try {
      const submissions = await estudianteService.getMySubmissions(req.user!.id);
      res.status(200).json({ status: 'success', data: submissions });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getRanking(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const ranking = await estudianteService.getRanking(page, limit);
      res.status(200).json({ status: 'success', ...ranking });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async submitChallenge(req: AuthRequest, res: Response) {
    try {
      const submission = await estudianteService.submitChallenge(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: submission });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
