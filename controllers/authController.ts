import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      const user = await AuthService.register(username, password, role);
      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const accessToken = await AuthService.refreshToken(refreshToken);
      res.json({ accessToken });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const user = await AuthService.getMe(userId);
      res.json({ user });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
