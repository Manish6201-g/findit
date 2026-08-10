import mongoose, { Schema, Document } from 'mongoose';
import { IClaim as IClaimShared } from '../../../../shared/types';

export interface IClaimDocument extends Omit<IClaimShared, '_id' | 'createdAt' | 'updatedAt' | 'item' | 'claimer'>, Document {
  item: mongoose.Types.ObjectId;
  claimer: mongoose.Types.ObjectId;
}

const ClaimSchema: Schema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    claimer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    proofDescription: { type: String, required: true },
    uniqueMarks: { type: String },
    receiptImage: { type: String },
    extraImages: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'more-info-requested'],
      default: 'pending',
      index: true,
    },
    adminNotes: { type: String },
    verificationTimeline: [
      {
        status: String,
        message: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClaimDocument>('Claim', ClaimSchema);
