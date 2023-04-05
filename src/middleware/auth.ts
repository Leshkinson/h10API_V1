import jwt, {JwtPayload} from "jsonwebtoken";
import {QueryService} from "../services/query-service";
import {Request, Response, NextFunction} from "express";
import {JWT, TokenService} from "../application/token-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)

        return;
    }

    if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.sendStatus(401)

        return;
    }

    const token = req.headers.authorization.split(' ')[1]

    const foo = jwt.decode(token)
    if (!foo) {
        res.sendStatus(401)

        return;
    }
    const tokenService = new TokenService()
    const queryService = new QueryService()
    const payload: string | JwtPayload | JWT = await tokenService.getPayloadByAccessToken(token) as JWT
    if (!payload) {
        res.sendStatus(401)

        return;
    }
    const user = await queryService.findUser(payload.id)

    if (!user) {
        res.sendStatus(401)

        return;
    }

    next()

}