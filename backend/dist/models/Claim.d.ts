import mongoose, { Document } from 'mongoose';
export interface IClaim extends Document {
    item: mongoose.Types.ObjectId;
    claimer: mongoose.Types.ObjectId;
    description: string;
    proofImages: string[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IClaim, {}, {}, {}, Document<unknown, {}, IClaim, {}, mongoose.DefaultSchemaOptions> & IClaim & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IClaim>;
export default _default;
//# sourceMappingURL=Claim.d.ts.map