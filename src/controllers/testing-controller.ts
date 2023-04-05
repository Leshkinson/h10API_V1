import {Request, Response} from "express";
import {BlogService} from "../services/blog-service";
import {PostService} from "../services/post-service";
import {UserService} from "../services/user-service";
import {CommentService} from "../services/comment-service";

export class TestController {
    static async testing(req: Request, res: Response): Promise<void> {
        try {
            const blogService = new BlogService();
            const postService = new PostService();
            const userService = new UserService();
            const commentService = new CommentService()
            await blogService.testingDelete();
            await postService.testingDelete();
            await userService.testingDelete();
            await commentService.testingDelete();
            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}