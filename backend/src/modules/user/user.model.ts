import mongoose, { Schema, Document } from 'mongoose';
import { IUser as IUserShared } from '../../../../shared/types';

export interface IUserDocument extends Omit<IUserShared, '_id' | 'createdAt' | 'updatedAt'>, Document {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // For email/password auth
    rollNumber: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: String },
    phone: { type: String, trim: true },
    hostel: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bio: { type: String, maxlength: 500 },
    profilePicture: { type: String },
    role: {
      type: String,
      enum: ['guest', 'student', 'faculty', 'admin', 'super-admin'],
      default: 'student',
    },
    points: { type: Number, default: 0 },
    itemsReturned: { type: Number, default: 0 },
    itemsFound: { type: Number, default: 0 },
    badges: [{ type: String }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    refreshToken: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: false },
    otp: {
      code: String,
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search and performance
UserSchema.index({ email: 1 });
UserSchema.index({ rollNumber: 1 });

export default mongoose.model<IUserDocument>('User', UserSchema);
