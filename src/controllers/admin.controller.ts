import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const adminService = new AdminService();

export class AdminController {
  public async getDashboard(req: Request, res: Response) {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({ status: 'success', data: stats });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const users = await adminService.getUsers(page, limit);
      res.status(200).json({ status: 'success', ...users });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const user = await adminService.getUserById(userId);
      if(!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      res.status(200).json({ status: 'success', data: user });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async updateUserStatus(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const { estado_cuenta } = req.body;
      const updatedUser = await adminService.updateUserStatus(userId, estado_cuenta);
      res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async updateUserRole(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const { id_usuario_tipo } = req.body;
      const updatedUser = await adminService.updateUserRole(userId, id_usuario_tipo);
      res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async deleteUser(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.params.userId);
      await adminService.deleteUser(userId);
      res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // --- MASTER DATA ---
  public async createTopic(req: Request, res: Response) {
    try {
      const topic = await adminService.createTopic(req.body);
      res.status(201).json({ status: 'success', data: topic });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async createSkill(req: Request, res: Response) {
    try {
      const skill = await adminService.createSkill(req.body);
      res.status(201).json({ status: 'success', data: skill });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  public async getSkills(req: Request, res: Response) {
    try {
      const skills = await adminService.getSkills();
      res.status(200).json({ status: 'success', data: skills });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
