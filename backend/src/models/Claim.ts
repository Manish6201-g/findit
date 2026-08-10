import mongoose, { Schema, Document } from 'mongoose';

export interface IClaim extends Document {
  item: mongoose.Types.ObjectId;
  claimer: mongoose.Types.ObjectId;
  description: string;
  proofImages: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema: Schema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    claimer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    proofImages: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IClaim>('Claim', ClaimSchema);
