import { Request, Response } from 'express';
import { ChallengeService } from '../services/challenge.service';
import { StorageService } from '../services/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const challengeService = new ChallengeService();
const storageService = new StorageService();

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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let imagen_url = '';
      let documento_url = '';

      if (files?.['imagen']) {
        imagen_url = await storageService.uploadFile(files['imagen'][0], 'challenges/images');
      }
      if (files?.['documento']) {
        documento_url = await storageService.uploadFile(files['documento'][0], 'challenges/docs');
      }

      // Parse pasos if sent as JSON string (multipart/form-data serializes arrays as strings)
      let pasos = req.body.pasos;
      if (typeof pasos === 'string') {
        try { pasos = JSON.parse(pasos); } catch { pasos = []; }
      }

      // Build guia_pasos as JSON fallback for backward compatibility
      const guia_pasos = Array.isArray(pasos) && pasos.length > 0
        ? JSON.stringify(pasos.map((p: any) => ({ title: p.titulo || p.title, description: p.descripcion || p.description })))
        : '';

      const challengeData = {
        ...req.body,
        id_tema: Number(req.body.id_tema),
        id_nivel_dificultad: Number(req.body.id_nivel_dificultad),
        imagen_url,
        documento_url,
        guia_pasos: req.body.guia_pasos || guia_pasos,
        pasos
      };

      const newChallenge = await challengeService.createChallenge(req.user!.id, challengeData);
      res.status(201).json({ status: 'success', data: newChallenge });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async updateChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Parse pasos if sent as JSON string
      let pasos = req.body.pasos;
      if (typeof pasos === 'string') {
        try { pasos = JSON.parse(pasos); } catch { pasos = undefined; }
      }

      const updateData = {
        ...req.body,
        pasos
      };

      const updatedChallenge = await challengeService.updateChallenge(id, req.user!.id, updateData);
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

  public async createTopic(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre) {
        res.status(400).json({ status: 'error', message: 'Topic name is required' });
        return;
      }
      const topic = await challengeService.createTopic(nombre, descripcion || '');
      res.status(201).json({ status: 'success', data: topic });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
