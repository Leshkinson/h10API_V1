import {IPost} from "../ts/interfaces";
import mongoose, {Schema} from "mongoose";

export const PostSchema = new Schema({
    title: {type: "string", required: true},
    shortDescription: {type: "string", required: true},
    content: {type: "string", required: true},
    blogId: {type: "string", required: true},
    blogName: {type: "string", required: true},
}, {timestamps: true});

PostSchema.set('toJSON', {
    transform: function (doc, dto) {
        dto.id = dto._id;
        delete dto._id;
        delete dto.__v;
        delete dto.updatedAt
    }
})

export const PostModel = mongoose.model<IPost>('Post', PostSchema)