import mongoose, { Document } from 'mongoose';
import { IItem as IItemShared } from '../../../../shared/types';
export interface IItemDocument extends Omit<IItemShared, '_id' | 'createdAt' | 'updatedAt' | 'owner'>, Document {
    owner: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IItemDocument, {}, {}, {}, Document<unknown, {}, IItemDocument, {}, mongoose.DefaultSchemaOptions> & IItemDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IItemDocument>;
export default _default;
//# sourceMappingURL=item.model.d.ts.map