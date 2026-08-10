import mongoose, { Document } from 'mongoose';
export interface ISuccessStoryDocument extends Document {
    item: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    title: string;
    story: string;
    images: string[];
    likes: mongoose.Types.ObjectId[];
    comments: {
        user: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
}
declare const _default: mongoose.Model<ISuccessStoryDocument, {}, {}, {}, Document<unknown, {}, ISuccessStoryDocument, {}, mongoose.DefaultSchemaOptions> & ISuccessStoryDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISuccessStoryDocument>;
export default _default;
//# sourceMappingURL=success-story.model.d.ts.map