import {Request, Response} from "express";
import {IBlog, IPost} from "../ts/interfaces";
import {BlogService} from "../services/blog-service";
import {QueryService} from "../services/query-service";
import {BlogsRequest, BlogsRequestWithoutSNT} from "../ts/types";

export class BlogController {
    static async getAllBlogs(req: Request, res: Response) {
        try {
            const blogService = new BlogService();
            const queryService = new QueryService();

            let {pageNumber, pageSize, sortBy, searchNameTerm, sortDirection} = req.query as BlogsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const blogs: IBlog[] = await blogService.getAll(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection);
            const totalCount: number = await queryService.getTotalCountForBlogs(searchNameTerm);

            res.status(200).json({
                "pagesCount": Math.ceil(totalCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": blogs,
            });
        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
        }
    }

    static async createBlog(req: Request, res: Response) {
        try {
            const blogService = new BlogService();

            const {name, description, websiteUrl} = req.body;
            const newBlogs: IBlog = await blogService.create(name, description, websiteUrl);

            res.status(201).json(newBlogs);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    static async getOneBlog(req: Request, res: Response) {
        try {
            const blogService = new BlogService();

            const {id} = req.params;
            const findBlog: IBlog | undefined = await blogService.getOne(id);

            res.status(200).json(findBlog);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async updateBlog(req: Request, res: Response) {
        try {
            const blogService = new BlogService();

            const {id} = req.params;
            const {name, description, websiteUrl} = req.body;
            const updateBlog: IBlog | undefined = await blogService.update(id, name, description, websiteUrl);

            if (updateBlog) res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async deleteBlog(req: Request, res: Response) {
        try {
            const blogService = new BlogService();

            const {id} = req.params;
            await blogService.delete(id);

            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async getAllPostsForTheBlog(req: Request, res: Response) {
        try {
            const queryService = new QueryService();

            const {blogId} = req.params;
            let {pageNumber, pageSize, sortDirection, sortBy} = req.query as BlogsRequestWithoutSNT;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const posts: IPost[] = await queryService.getPostsForTheBlog(blogId, pageNumber, pageSize, sortBy, sortDirection);
            const totalCount: number = await queryService.getTotalCountPostsForTheBlog(blogId);

            res.status(200).json({
                "pagesCount": Math.ceil(totalCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": posts
            })
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async createPostTheBlog(req: Request, res: Response) {
        try {
            const queryService = new QueryService();

            const {blogId} = req.params;
            const {title, shortDescription, content} = req.body;
            const newPost: IPost | undefined = await queryService.createPostForTheBlog(blogId, title, shortDescription, content);

            if (newPost) res.status(201).json(newPost);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}