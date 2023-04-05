import {IBlog} from "../ts/interfaces";
import {BlogModel} from "../models/blog-model";
import {Model, RefType, SortOrder} from "mongoose";

export class BlogsRepository {
    private blogModel: Model<IBlog>;

    constructor() {
        this.blogModel = BlogModel;
    }

    public async getAllBlogs(
        searchNameTerm: { name: { $regex: RegExp } } | {} = {},
        skip: number = 0,
        limit: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: SortOrder = 'desc'
    ): Promise<IBlog[]> {
        return this.blogModel.find(searchNameTerm).sort({[sortBy]: sortDirection}).skip(skip).limit(limit);
    }

    public async getBlogsCount(searchNameTerm: { name: { $regex: RegExp } } | {} = {}): Promise<number> {
        return this.blogModel.countDocuments(searchNameTerm);
    }

    public async createBlog(name: string, description: string, websiteUrl: string): Promise<IBlog> {
        return await this.blogModel.create({name, description, websiteUrl, isMembership: false});
    }

    public async getOneBlog(id: RefType): Promise<IBlog | null> {
        return this.blogModel.findById({_id: id});
    }

    public async updateBlog(id: RefType, name: string, description: string, websiteUrl: string): Promise<IBlog| null> {
        return this.blogModel.findOneAndUpdate({_id: id}, {
            name,
            description,
            websiteUrl
        })
    }

    public async deleteBlog(id: RefType) {
        return this.blogModel.findOneAndDelete({_id: id});
    }

    public async deleteAll() {
        return this.blogModel.deleteMany();
    }
}