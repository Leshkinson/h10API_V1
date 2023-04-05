import {IPost} from "../ts/interfaces";
import {PostModel} from "../models/post-model";
import {Model, RefType, SortOrder} from "mongoose";

export class PostsRepository {
    private postModel: Model<IPost>;

    constructor() {
        this.postModel = PostModel;
    }

    public async getAllPosts(
        pageNumber: number = 1,
        limit: number = 10,
        sortBy: string = 'createdAt',
        skip: number = 0,
        sortDirection: SortOrder = 'desc'): Promise<IPost[]> {

        return this.postModel.find().sort({[sortBy]: sortDirection}).skip(skip).limit(limit);
    }

    public async createPost(title: string, shortDescription: string, content: string, blogId: string | undefined, blogName: string | undefined): Promise<IPost> {
        return await this.postModel.create({title, shortDescription, content, blogId, blogName});
    }

    public async getOnePost(id: RefType): Promise<IPost | null> {
        return this.postModel.findById({_id: id});
    }

    public async updatePost(id: RefType, title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | null> {
        return this.postModel.findOneAndUpdate({_id: id}, {
            title,
            shortDescription,
            content,
            blogId
        })
    }

    public async deletePost(id: RefType) {
        return this.postModel.findOneAndDelete({_id: id});
    }

    public async deleteAll() {
        return this.postModel.deleteMany();
    }
}