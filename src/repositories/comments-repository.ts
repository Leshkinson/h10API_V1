import {Model, RefType} from "mongoose";
import {IComment} from "../ts/interfaces";
import {CommentModel} from "../models/comment-model";

export class CommentsRepository {
    private commentModel: Model<IComment>;

    constructor() {
        this.commentModel = CommentModel;
    }

    public async createComment(content: string, postId: RefType, userId: string, userLogin: string): Promise<IComment> {
        return this.commentModel.create({content, postId, commentatorInfo:{userId, userLogin}})
    }

    public async updateComment(id: RefType, content: string): Promise<IComment| null> {
        return this.commentModel.findOneAndUpdate({_id: id}, {content})
    }

    public async getOneComment(id: RefType): Promise<IComment | null> {
        return this.commentModel.findById({_id: id});
    }

    public async deleteComment(id: RefType) {
        return this.commentModel.findOneAndDelete({_id: id});
    }

    public async deleteAll() {
        return this.commentModel.deleteMany();
    }
}