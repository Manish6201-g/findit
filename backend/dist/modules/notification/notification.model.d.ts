import mongoose, { Document } from 'mongoose';
import { INotification as INotificationShared } from '../../../../shared/types';
export interface INotificationDocument extends Omit<INotificationShared, '_id' | 'createdAt' | 'user'>, Document {
    user: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<INotificationDocument, {}, {}, {}, Document<unknown, {}, INotificationDocument, {}, mongoose.DefaultSchemaOptions> & INotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotificationDocument>;
export default _default;
//# sourceMappingURL=notification.model.d.ts.map