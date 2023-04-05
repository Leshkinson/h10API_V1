import mongoose, {Schema} from "mongoose";
import {IComment} from "../ts/interfaces";


export const CommentSchema = new Schema({
    content: {type: "string", required: true},
    postId: {type: "string", required: true},
    commentatorInfo: {
        userId: {type: "string", required: true},
        userLogin: {type: "string", required: true}
    }
}, {timestamps: true})

CommentSchema.set('toJSON', {
    transform: function (doc, dto) {
        dto.id = dto._id;
        delete dto._id;
        delete dto.__v;
        delete dto.updatedAt;
        delete dto.postId;
    }
})

CommentSchema.set('id', true);

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema)