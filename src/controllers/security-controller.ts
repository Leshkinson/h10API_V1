import {Request, Response} from "express";
import {QueryService} from "../services/query-service";
import {SessionService} from "../services/session-service";
import {JWT, TokenService} from "../application/token-service";

export class SecurityController {
    static async getAllDevices(req: Request, res: Response) {
        try {
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const sessionService = new SessionService();

            const {refreshToken} = req.cookies;
            if (!refreshToken) throw new Error;
            const isBlockedToken = await tokenService.checkTokenByBlackList(refreshToken);
            if (isBlockedToken) throw new Error;
            const payload = await tokenService.getPayloadByRefreshToken(refreshToken) as JWT;
            if (!payload) throw new Error;
            const user = await queryService.findUserByEmail(payload.email);
            if (user) {
                const sessions = await sessionService.getAllSessionByUser(String(user._id));
                res.status(200).json(sessions)
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }

    static async terminateDevicesSession(req: Request, res: Response) {
        try {
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const sessionService = new SessionService();

            const {refreshToken} = req.cookies;
            if (!refreshToken) throw new Error;
            const isBlockedToken = await tokenService.checkTokenByBlackList(refreshToken);
            if (isBlockedToken) throw new Error;
            const payload = await tokenService.getPayloadByRefreshToken(refreshToken) as JWT;
            if (!payload) {
                res.sendStatus(403)
                return
            }
            const user = await queryService.findUserByEmail(payload.email);
            if (user) {
                await sessionService.deleteSessionWithExcept(String(user._id), payload.deviceId)
                res.sendStatus(204)
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }

    static async terminateTheDeviceSession(req: Request, res: Response) {
        try {
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const sessionService = new SessionService();

            const {deviceId} = req.params;
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                res.sendStatus(401)
                return
            }
            const isBlockedToken = await tokenService.checkTokenByBlackList(refreshToken);
            if (isBlockedToken) {
                res.sendStatus(401)
                return
            }
            const payload = await tokenService.getPayloadByRefreshToken(refreshToken) as JWT;
            if (!payload) {
                res.sendStatus(403)
                return
            }
            const user = await queryService.findUserByEmail(payload.email);
            if (!user) throw new Error;
            const session = await sessionService.findSession(deviceId);
            if (!session) throw new Error;
            if (session.userId !== (String(user._id))) {
                res.sendStatus(403)
                return
            }
            await sessionService.deleteTheSession(String(user._id), deviceId)
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async testLimit(req: Request, res: Response) {
        res.status(200).json('Hello')
    }
}