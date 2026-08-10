import mongoose, { Document } from 'mongoose';
export interface IChatDocument extends Document {
    participants: mongoose.Types.ObjectId[];
    item: mongoose.Types.ObjectId;
    lastMessage?: mongoose.Types.ObjectId;
    status: 'active' | 'archived';
}
declare const _default: mongoose.Model<IChatDocument, {}, {}, {}, Document<unknown, {}, IChatDocument, {}, mongoose.DefaultSchemaOptions> & IChatDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IChatDocument>;
export default _default;
//# sourceMappingURL=chat.model.d.ts.map