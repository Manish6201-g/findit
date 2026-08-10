import mongoose, { Schema, Document } from 'mongoose';

export interface ISuccessStoryDocument extends Document {
  item: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  story: string;
  images: string[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

const SuccessStorySchema: Schema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    images: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ISuccessStoryDocument>('SuccessStory', SuccessStorySchema);
