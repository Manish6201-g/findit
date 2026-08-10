import mongoose, { Document } from 'mongoose';
import { IClaim as IClaimShared } from '../../../../shared/types';
export interface IClaimDocument extends Omit<IClaimShared, '_id' | 'createdAt' | 'updatedAt' | 'item' | 'claimer'>, Document {
    item: mongoose.Types.ObjectId;
    claimer: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IClaimDocument, {}, {}, {}, Document<unknown, {}, IClaimDocument, {}, mongoose.DefaultSchemaOptions> & IClaimDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IClaimDocument>;
export default _default;
//# sourceMappingURL=claim.model.d.ts.map