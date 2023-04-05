import {RefType, SortOrder} from "mongoose";
import {IBlog, IPost} from "../ts/interfaces";
import {PostsRepository} from "../repositories/posts-repository";
import {BlogsRepository} from "../repositories/blogs-repository";

export class PostService {
    private postRepository: PostsRepository;
    private blogRepository: BlogsRepository;

    constructor() {
        this.postRepository = new PostsRepository();
        this.blogRepository = new BlogsRepository();
    }

    public async getAll(
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: SortOrder = 'desc'): Promise<IPost[]> {
        const skip: number = (pageNumber - 1) * pageSize;

        return await this.postRepository.getAllPosts(pageNumber, pageSize, sortBy, skip, sortDirection);
    }

    public async create(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost> {
        const blog: IBlog | null = await this.blogRepository.getOneBlog(blogId);
        if (blog) {
            return await this.postRepository.createPost(title, shortDescription, content, (blog?._id).toString(), blog?.name);
        }
        throw new Error();
    }

    public async find(id: RefType): Promise<IPost | undefined> {
        const post = await this.postRepository.getOnePost(id);
        if (!post) throw new Error();

        return post;
    }

    public async getOne(id: RefType): Promise<IPost | undefined> {
        const findPost: IPost | undefined = await this.find(id);
        if (findPost) return findPost;
        throw new Error();
    }

    public async update(id: RefType, title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | undefined> {
        const blog: IBlog | undefined | null = await this.blogRepository.getOneBlog(blogId);
        const updatePost: IPost | undefined | null = await this.postRepository.updatePost(id, title, shortDescription, content, blogId);
        if (blog && updatePost) {
            updatePost.title = title;
            updatePost.shortDescription = shortDescription;
            updatePost.content = content;

            return updatePost;
        }
        throw new Error();
    }

    public async delete(id: string): Promise<IPost> {
        const deletePost = await this.postRepository.deletePost(id);
        if (deletePost) return deletePost;
        throw new Error();
    }

    public async testingDelete(): Promise<void> {
        await this.postRepository.deleteAll();
    }
}