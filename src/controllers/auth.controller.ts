import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json({ status: 'success', message: 'User created successfully', data: result });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.loginUser(req.body);
      res.status(200).json({ status: 'success', ...result });
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  public async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'User not authenticated' });
        return;
      }
      const userId = req.user.id;
      const user = await authService.getUserById(userId);
      res.status(200).json({ status: 'success', data: user });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
