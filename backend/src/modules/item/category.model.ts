import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  icon?: string;
  itemCount: number;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String },
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICategoryDocument>('Category', CategorySchema);
