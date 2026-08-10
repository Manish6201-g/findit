import express from 'express';
import {
  createClaim,
  getClaims,
  getClaimById,
  updateClaimStatus,
} from '../controllers/claim.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/', protect, getClaims);
router.get('/:id', protect, getClaimById);
router.put('/:id/status', protect, admin, updateClaimStatus);

export default router;
