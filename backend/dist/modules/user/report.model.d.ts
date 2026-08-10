import mongoose, { Document } from 'mongoose';
export interface IReportDocument extends Document {
    reporter: mongoose.Types.ObjectId;
    targetModel: 'Item' | 'User' | 'Message';
    targetId: mongoose.Types.ObjectId;
    reason: string;
    description?: string;
    status: 'pending' | 'resolved' | 'dismissed';
}
declare const _default: mongoose.Model<IReportDocument, {}, {}, {}, Document<unknown, {}, IReportDocument, {}, mongoose.DefaultSchemaOptions> & IReportDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReportDocument>;
export default _default;
//# sourceMappingURL=report.model.d.ts.map