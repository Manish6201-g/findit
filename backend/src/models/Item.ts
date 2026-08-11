import mongoose, { Schema, Document } from 'mongoose';

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'claimed' | 'returned' | 'hidden';

export interface IItem extends Document {
  type: ItemType;
  name: string;
  category: string;
  description: string;
  brand?: string;
  color?: string;
  date: Date;
  time?: string;
  location: string;
  images: string[];
  owner: mongoose.Types.ObjectId;
  status: ItemStatus;
  reward?: number;
  additionalNotes?: string;
  currentHolder?: string;
  canDeliver?: boolean;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String },
    color: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String, required: true },
    images: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['active', 'claimed', 'returned', 'hidden'],
      default: 'active',
    },
    reward: { type: Number },
    additionalNotes: { type: String },
    currentHolder: { type: String },
    canDeliver: { type: Boolean },
    qrCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);
