import {IUser} from "../ts/interfaces";
import {UsersRequest} from "../ts/types";
import {Request, Response} from "express";
import {UserService} from "../services/user-service";
import {QueryService} from "../services/query-service";

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const userService = new UserService()
            const queryService = new QueryService();

            let {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = req.query as UsersRequest
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const users: IUser[] = await userService.getAll(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm);
            const totalCount: number = await queryService.getTotalCountForUsers(searchLoginTerm, searchEmailTerm);

            res.status(200).json({
                "pagesCount": Math.ceil(totalCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": totalCount,
                "items": users,
            });
        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
        }
    }

    static async createUser(req: Request, res: Response) {
        try {
            const userService = new UserService();

            const {login, password, email} = req.body;
            const newUser: IUser = await userService.create(login, password, email);
            console.log('newUser controller', newUser)

            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userService = new UserService();

            const {id} = req.params;
            await userService.delete(id);

            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}