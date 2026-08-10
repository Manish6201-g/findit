import mongoose, { Schema, Document } from 'mongoose';

export interface IChatDocument extends Document {
  participants: mongoose.Types.ObjectId[];
  item: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  status: 'active' | 'archived';
}

const ChatSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1 });
ChatSchema.index({ item: 1 });

export default mongoose.model<IChatDocument>('Chat', ChatSchema);
