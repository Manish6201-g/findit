import mongoose, { Document } from 'mongoose';
export interface IAuditLogDocument extends Document {
    admin: mongoose.Types.ObjectId;
    action: string;
    targetModel: string;
    targetId: mongoose.Types.ObjectId;
    changes: any;
    ipAddress?: string;
}
declare const _default: mongoose.Model<IAuditLogDocument, {}, {}, {}, Document<unknown, {}, IAuditLogDocument, {}, mongoose.DefaultSchemaOptions> & IAuditLogDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAuditLogDocument>;
export default _default;
//# sourceMappingURL=audit-log.model.d.ts.map