import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'match' | 'claim' | 'message' | 'system';
    read: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<INotification, {}, {}, {}, Document<unknown, {}, INotification, {}, mongoose.DefaultSchemaOptions> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotification>;
export default _default;
//# sourceMappingURL=Notification.d.ts.map