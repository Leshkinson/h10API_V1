import {RefType} from "mongoose";
import {IComment} from "../ts/interfaces";
import {CommentsRepository} from "../repositories/comments-repository";

export class CommentService {
    private commentRepository: CommentsRepository

    constructor() {
        this.commentRepository = new CommentsRepository()
    }

    public async find(id: RefType): Promise<IComment | undefined> {
        const comment = await this.commentRepository.getOneComment(id);
        if (!comment) throw new Error();

        return comment;
    }

    public async update(id: RefType, content: string): Promise<IComment | undefined> {
        const updateComment: IComment | undefined | null = await this.commentRepository.updateComment(id, content);
        if (updateComment) return updateComment;
        throw new Error();
    }

    public async getOne(id: RefType): Promise<IComment | undefined> {
        const findComment: IComment | undefined = await this.find(id);
        if (findComment) return findComment;
        throw new Error();
    }

    public async delete(id: RefType): Promise<IComment> {
        const deleteComment = await this.commentRepository.deleteComment(id)
        if (deleteComment) return deleteComment
        throw new Error();
    }

    public async testingDelete(): Promise<void> {
        await this.commentRepository.deleteAll();
    }
}