import mongoose, { Document } from 'mongoose';
export interface IMessageDocument extends Document {
    chat: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    readBy: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IMessageDocument, {}, {}, {}, Document<unknown, {}, IMessageDocument, {}, mongoose.DefaultSchemaOptions> & IMessageDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMessageDocument>;
export default _default;
//# sourceMappingURL=message.model.d.ts.map