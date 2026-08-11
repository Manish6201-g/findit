import { Response } from 'express';
import Message from '../models/Message';
import Item from '../models/Item';

export const getMessages = async (req: any, res: Response) => {
  try {
    const { itemId, receiverId, userId } = req.query;
    const currentUserId = req.user.id;
    const otherUserId = receiverId || userId;

    const query: any = {};

    if (itemId) {
      query.item = itemId;
    }

    if (otherUserId) {
      query.$or = [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ];
    } else {
      query.$or = [{ sender: currentUserId }, { receiver: currentUserId }];
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('item', 'name type status');

    return res.json(messages);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { receiver, item: itemId, content } = req.body;
    const sender = req.user.id;

    if (!receiver || !itemId || !content) {
      return res.status(400).json({ message: 'Please provide receiver, item, and message content' });
    }

    const itemObj = await Item.findById(itemId);
    if (!itemObj) {
      return res.status(404).json({ message: 'Associated item not found' });
    }

    const message = await Message.create({
      sender,
      receiver,
      item: itemId,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('item', 'name type status');

    return res.status(201).json(populatedMessage);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to send message' });
  }
};
