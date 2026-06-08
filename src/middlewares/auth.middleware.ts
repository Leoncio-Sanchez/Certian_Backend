import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    res.status(401).json({ status: 'error', message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    res.status(401).json({ status: 'error', message: 'Token is not valid' });
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      console.error('Role Middleware: req.user is undefined');
      res.status(403).json({ status: 'error', message: 'Access denied: No user info' });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      console.error(`Role Middleware: User role "${req.user.role}" not in allowed list [${roles}]`);
      res.status(403).json({ status: 'error', message: 'Access denied: Insufficient permissions' });
      return;
    }
    next();
  };
};
