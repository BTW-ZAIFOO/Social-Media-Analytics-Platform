import express from 'express';
import { downloadReport } from '../controllers/report.controller.ts';

const router = express.Router();

router.get('/', downloadReport);

export default router;
