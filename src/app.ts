import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import challengeRoutes from './routes/challenge.routes';
import companyRoutes from './routes/company.routes';
import estudianteRoutes from './routes/estudiante.routes';
import adminRoutes from './routes/admin.routes';
import invitadoRoutes from './routes/invitado.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors({
      origin: env.NODE_ENV === 'production' ? 'https://tu-dominio-frontend.com' : '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    }));
    
    this.app.use(helmet());
    this.app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again in 15 minutes',
    });
    this.app.use('/api', limiter);
  }

  private initializeRoutes(): void {
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'success', message: 'API is running', environment: env.NODE_ENV });
    });
    
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/challenges', challengeRoutes);
    this.app.use('/api/companies', companyRoutes);
    this.app.use('/api/estudiantes', estudianteRoutes);
    this.app.use('/api/admin', adminRoutes);
    this.app.use('/api/invitado', invitadoRoutes);
  }

  private initializeErrorHandling(): void {
    // 404 handler - catch all unmatched routes
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    this.app.use(globalErrorHandler);
  }

  public listen(): void {
    this.app.listen(env.PORT, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${env.NODE_ENV} =======`);
      console.log(`🚀 App listening on the port ${env.PORT}`);
      console.log(`=================================`);
    });
  }
}
