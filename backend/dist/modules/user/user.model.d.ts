import mongoose, { Document } from 'mongoose';
import { IUser as IUserShared } from '../../../../shared/types';
export interface IUserDocument extends Omit<IUserShared, '_id' | 'createdAt' | 'updatedAt'>, Document {
}
declare const _default: mongoose.Model<IUserDocument, {}, {}, {}, Document<unknown, {}, IUserDocument, {}, mongoose.DefaultSchemaOptions> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserDocument>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map