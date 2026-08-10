import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: any, res: Response) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

export const markAsRead = async (req: any, res: Response) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
};
