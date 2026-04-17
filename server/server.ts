import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db.ts';
import dashboardRoutes from './routes/dashboard.routes.ts';
import campaignRoutes from './routes/campaign.routes.ts';
import reportRoutes from './routes/report.routes.ts';
import syncRoutes from './routes/sync.routes.ts';
import socialRoutes from './routes/social.ts';
import dataRoutes from './routes/data.routes.ts';
import errorHandler from './middleware/error.middleware.ts';
import { startScheduler } from './utils/scheduler.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/data', dataRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is healthy.' });
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      startScheduler();
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', (error as Error).message);
    process.exit(1);
  });
