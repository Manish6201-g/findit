import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/item.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.patch('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

export default router;
