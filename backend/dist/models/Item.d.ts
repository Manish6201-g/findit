import mongoose, { Document } from 'mongoose';
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
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IItem, {}, {}, {}, Document<unknown, {}, IItem, {}, mongoose.DefaultSchemaOptions> & IItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IItem>;
export default _default;
//# sourceMappingURL=Item.d.ts.map