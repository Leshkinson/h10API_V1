import dotenv from "dotenv";
import {Request, Response, NextFunction} from "express";

dotenv.config();
const LOGIN = 'admin';
const PASSWORD = 'qwerty';
const TRUEPassword = 'Basic YWRtaW46cXdlcnR5';

export const basicAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const authorization: string | undefined = req.headers.authorization;
    if (!authorization || authorization !== TRUEPassword) {
        res.sendStatus(401)

        return;
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [login, password] = decoded.split(':');
    if (login !== LOGIN || password !== PASSWORD) {
        res.sendStatus(401)

        return;
    }
    next()
}