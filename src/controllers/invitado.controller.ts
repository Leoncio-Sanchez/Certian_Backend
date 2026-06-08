import { Request, Response } from 'express';
import { InvitadoService } from '../services/invitado.service';

const invitadoService = new InvitadoService();

export class InvitadoController {
  public async getWelcome(req: Request, res: Response) {
    try {
      const featuredCompanies = await invitadoService.getAliasedCompanies();
      res.status(200).json({ 
        status: 'success', 
        message: 'Bienvenido al módulo de Invitado.',
        data: {
          availableFeatures: [
            'Ver desafíos públicos',
            'Explorar empresas aliadas',
            'Información sobre la plataforma'
          ],
          featuredCompanies
        }
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getPublicChallenges(req: Request, res: Response) {
    try {
      const challenges = await invitadoService.getPublicChallenges();
      res.status(200).json({ 
        status: 'success', 
        data: challenges
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
