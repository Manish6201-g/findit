import mongoose, { Document } from 'mongoose';
export interface ICategoryDocument extends Document {
    name: string;
    slug: string;
    icon?: string;
    itemCount: number;
}
declare const _default: mongoose.Model<ICategoryDocument, {}, {}, {}, Document<unknown, {}, ICategoryDocument, {}, mongoose.DefaultSchemaOptions> & ICategoryDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICategoryDocument>;
export default _default;
//# sourceMappingURL=category.model.d.ts.map