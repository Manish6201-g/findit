import { Request, Response } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: any, res: Response) => {
  const { userId, itemId } = req.query;

  const messages = await Message.find({
    item: itemId,
    $or: [
      { sender: req.user.id, receiver: userId },
      { sender: userId, receiver: req.user.id },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
};

export const getConversations = async (req: any, res: Response) => {
  // Get all unique users the current user has chatted with for various items
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: new req.user.id() }, { receiver: new req.user.id() }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          item: '$item',
          otherUser: {
            $cond: [
              { $eq: ['$sender', new req.user.id()] },
              '$receiver',
              '$sender',
            ],
          },
        },
        lastMessage: { $first: '$content' },
        createdAt: { $first: '$createdAt' },
      },
    },
  ]);

  res.json(conversations);
};
// Note: Real message sending will be handled by Socket.io, 
// but we might need a fallback or initial message endpoint.
