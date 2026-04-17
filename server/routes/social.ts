import { Router } from 'express';
import {
  getSocialAccounts,
  createSocialAccount,
  deleteSocialAccount,
  getDashboardMetrics,
  previewSocialAccount,
} from '../controllers/social.controller.ts';

const router = Router();

router.get('/accounts', getSocialAccounts);
router.post('/accounts', createSocialAccount);
router.delete('/accounts/:id', deleteSocialAccount);
router.get('/metrics', getDashboardMetrics);
router.get('/preview', previewSocialAccount);

export default router;
