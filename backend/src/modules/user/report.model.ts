import mongoose, { Schema, Document } from 'mongoose';

export interface IReportDocument extends Document {
  reporter: mongoose.Types.ObjectId;
  targetModel: 'Item' | 'User' | 'Message';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

const ReportSchema: Schema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetModel: { type: String, enum: ['Item', 'User', 'Message'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReportDocument>('Report', ReportSchema);
