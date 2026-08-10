import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLogDocument extends Document {
  admin: mongoose.Types.ObjectId;
  action: string;
  targetModel: string;
  targetId: mongoose.Types.ObjectId;
  changes: any;
  ipAddress?: string;
}

const AuditLogSchema: Schema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    targetModel: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    changes: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
