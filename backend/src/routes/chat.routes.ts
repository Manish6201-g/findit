import express from 'express';
import { getMessages, getConversations } from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getMessages);
router.get('/conversations', protect, getConversations);

export default router;
