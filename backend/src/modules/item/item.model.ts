import mongoose, { Schema, Document } from 'mongoose';
import { IItem as IItemShared } from '../../../../shared/types';

export interface IItemDocument extends Omit<IItemShared, '_id' | 'createdAt' | 'updatedAt' | 'owner'>, Document {
  owner: mongoose.Types.ObjectId;
}

const ItemSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    color: { type: String, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    date: { type: Date, required: true, index: true },
    time: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      building: { type: String, trim: true },
      floor: { type: String, trim: true },
      roomNumber: { type: String, trim: true },
      description: { type: String, required: true },
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['active', 'claimed', 'returned', 'hidden'],
      default: 'active',
      index: true,
    },
    reward: { type: Number, default: 0 },
    additionalNotes: { type: String },
    currentHolder: { type: String }, // For found items
    canDeliver: { type: Boolean, default: false },
    similarityScore: { type: Number }, // AI field
    qrCode: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// GeoJSON Index
ItemSchema.index({ location: '2dsphere' });

// Text Search Index
ItemSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  brand: 'text',
  model: 'text',
  'location.building': 'text',
});

export default mongoose.model<IItemDocument>('Item', ItemSchema);
