import {Request, Response} from "express";
import {IComment, IPost} from "../ts/interfaces";
import {PostService} from "../services/post-service";
import {QueryService} from "../services/query-service";
import {CommentsRequest, PostsRequest} from "../ts/types";

export class PostController {
    static async getAllPosts(req: Request, res: Response) {
        try {
            const postService = new PostService();
            const queryService = new QueryService();

            let {pageNumber, pageSize, sortBy, sortDirection} = req.query as PostsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const posts: IPost[] = await postService.getAll(pageNumber, pageSize, sortBy, sortDirection);
            const totalCount: number = await queryService.getTotalCountForPosts();

            res.status(200).json({
                "pagesCount": Math.ceil(totalCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": posts
            })
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    static async createPost(req: Request, res: Response) {
        try {
            const postService = new PostService();

            const {title, shortDescription, content, blogId} = req.body;
            const newPost: IPost | undefined = await postService.create(title, shortDescription, content, blogId);

            if (newPost) res.status(201).json(newPost);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    static async getOnePost(req: Request, res: Response) {
        try {
            const postService = new PostService();

            const {id} = req.params;
            const findPost: IPost | undefined = await postService.getOne(id);

            if (findPost) res.status(200).json(findPost);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async updatePost(req: Request, res: Response) {
        try {
            const postService = new PostService();

            const {id} = req.params;
            const {title, shortDescription, content, blogId} = req.body;

            const updatePost: IPost | undefined = await postService.update(id, title, shortDescription, content, blogId);
            if (updatePost) res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async deletePost(req: Request, res: Response) {
        try {
            const postService = new PostService();

            const {id} = req.params;
            await postService.delete(id);

            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async createCommentThePost(req: Request, res: Response) {
        try {
            const queryService = new QueryService();

            const {postId} = req.params;
            const {content} = req.body;
            const token = req.headers.authorization?.split(' ')[1]
            if (token) {
                const newComment: IComment | undefined = await queryService.createCommentForThePost(postId, content, token)
                console.log({newComment})
                if (newComment) res.status(201).json(newComment)
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async getAllCommentsForThePost(req: Request, res: Response) {
        try {
            const queryService = new QueryService();

            const {postId} = req.params;
            let {pageNumber, pageSize, sortDirection, sortBy} = req.query as CommentsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const comments: IComment[] = await queryService.getCommentsForThePost(postId, pageNumber, pageSize, sortBy, sortDirection);
            const totalCount: number = await queryService.getTotalCountCommentsForThePost(postId);

            res.status(200).json({
                "pagesCount": Math.ceil(totalCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": comments
            })

        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}