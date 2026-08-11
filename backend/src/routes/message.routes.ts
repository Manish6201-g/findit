import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);

export default router;
