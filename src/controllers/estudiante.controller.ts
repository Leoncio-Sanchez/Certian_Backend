import { Request, Response } from 'express';
import { EstudianteService } from '../services/estudiante.service';
import { StorageService } from '../services/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const estudianteService = new EstudianteService();
const storageService = new StorageService();

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

  public async submitChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const body = req.body;

      // Upload evidence files to R2 if present
      let solucion_texto_url = body.solucion_texto_url || '';
      let repositorio_url = body.repositorio_url || '';

      if (files?.['evidencia']) {
        const urls: string[] = [];
        for (const file of files['evidencia']) {
          const url = await storageService.uploadFile(file, `estudiantes/evidencias/${req.user!.id}`);
          urls.push(url);
        }
        solucion_texto_url = urls.join('\n'); // Join multiple file URLs with newlines
      }

      if (files?.['repositorio']) {
        repositorio_url = await storageService.uploadFile(
          files['repositorio'][0],
          `estudiantes/repositorios/${req.user!.id}`
        );
      }

      const submissionData = {
        ...body,
        id_reto: Number(body.id_reto),
        solucion_texto_url: solucion_texto_url || body.solucion_texto_url || repositorio_url || '',
        repositorio_url: repositorio_url || body.repositorio_url || '',
        contacto_networking: body.contacto_networking === 'true' || body.contacto_networking === true,
      };

      const submission = await estudianteService.submitChallenge(req.user!.id, submissionData);
      res.status(201).json({ status: 'success', data: submission });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
