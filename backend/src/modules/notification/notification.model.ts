import mongoose, { Schema, Document } from 'mongoose';
import { INotification as INotificationShared } from '../../../../shared/types';

export interface INotificationDocument extends Omit<INotificationShared, '_id' | 'createdAt' | 'user'>, Document {
  user: mongoose.Types.ObjectId;
}

const NotificationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['match', 'claim', 'message', 'system', 'announcement'],
      required: true,
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    link: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model<INotificationDocument>('Notification', NotificationSchema);
