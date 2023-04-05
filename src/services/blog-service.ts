import {IBlog} from "../ts/interfaces";
import {RefType, SortOrder} from "mongoose";
import {BlogsRepository} from "../repositories/blogs-repository";

export class BlogService {
    private blogRepository: BlogsRepository;

    constructor() {
        this.blogRepository = new BlogsRepository();
    }

    public async getAll(
        searchNameTerm: string | undefined | object,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: SortOrder | undefined = 'desc'
    ): Promise<IBlog[]> {
        if (searchNameTerm) searchNameTerm = {name: {$regex: new RegExp(`.*${searchNameTerm}.*`, 'i')}};
        const skip: number = Number((pageNumber - 1) * pageSize);

        return await this.blogRepository.getAllBlogs(searchNameTerm, skip, pageSize, sortBy, sortDirection);
    }

    public async create(name: string, description: string, websiteUrl: string): Promise<IBlog> {
        return await this.blogRepository.createBlog(name, description, websiteUrl);
    }

    public async find(id: RefType): Promise<IBlog | undefined> {
        const blog = await this.blogRepository.getOneBlog(id);
        if (!blog) throw new Error();

        return blog;
    }

    public async getOne(id: RefType): Promise<IBlog | undefined> {
        const findBlog: IBlog | undefined = await this.find(id);
        if (findBlog) return findBlog;
        throw new Error();
    }

    public async update(id: RefType, name: string, description: string, websiteUrl: string): Promise<IBlog | undefined> {
        const updateBlog: IBlog | undefined | null = await this.blogRepository.updateBlog(id, name, description, websiteUrl);
        if (updateBlog) return updateBlog;
        throw new Error();
    }

    public async delete(id: RefType): Promise<IBlog> {
        const deleteBlog = await this.blogRepository.deleteBlog(id);
        if (deleteBlog) return deleteBlog;
        throw new Error();
    }

    public async testingDelete(): Promise<void> {
        await this.blogRepository.deleteAll();
    }
}