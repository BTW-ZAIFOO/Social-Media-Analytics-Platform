import express from 'express';
import { syncData } from '../controllers/sync.controller.ts';

const router = express.Router();

router.get('/', syncData);

export default router;
