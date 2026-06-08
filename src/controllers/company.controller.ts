import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const companyService = new CompanyService();

export class CompanyController {
  public async getDashboard(req: AuthRequest, res: Response) {
    try {
      const stats = await companyService.getDashboardStats(req.user!.id);
      res.status(200).json({ status: 'success', data: stats });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async updateProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await companyService.updateProfile(req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getMyChallenges(req: AuthRequest, res: Response) {
    try {
      const challenges = await companyService.getMyChallenges(req.user!.id);
      res.status(200).json({ status: 'success', data: challenges });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getSubmissions(req: AuthRequest, res: Response) {
    try {
      const submissions = await companyService.getSubmissions(req.user!.id);
      res.status(200).json({ status: 'success', data: submissions });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async gradeSubmission(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const submission = await companyService.gradeSubmission(id, req.body);
      res.status(200).json({ status: 'success', data: submission });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async searchTalents(req: Request, res: Response) {
    try {
      const talents = await companyService.searchTalents(req.query);
      res.status(200).json({ status: 'success', data: talents });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
