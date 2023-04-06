import {Request, Response} from "express";
import {UserService} from "../services/user-service";
import {QueryService} from "../services/query-service";
import {TokenMapper} from "../dto/mappers/token-mapper";
import {JWT, TokenService} from "../application/token-service";
import {SessionService} from "../services/session-service";
import {IDevice} from "../ts/interfaces";

export class AuthController {

    static async login(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const tokenService = new TokenService();
            const sessionService = new SessionService();

            const {loginOrEmail, password} = req.body;
            const user = await userService.verifyUser(loginOrEmail, password);

            if (user && user.isConfirmed) {
                const sessionDevice = await sessionService.generateSession(req.ip, req.headers["user-agent"], String(user._id))
                const accessToken = tokenService.generateAccessToken(TokenMapper.prepareAccessModel(user));
                const refreshToken = tokenService.generateRefreshToken(TokenMapper.prepareRefreshModel(user, sessionDevice));

                res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        // maxAge: 24 * 60 * 60 * 1000
                    }
                );

                res.status(200).json({
                    "accessToken": accessToken
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }

    static async logout(req: Request, res: Response) {
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
                await tokenService.addTokenToBlackList(refreshToken)
                await sessionService.deleteTheSession(String(user._id), payload.deviceId)
                res.clearCookie('refreshToken');
                res.sendStatus(204);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }

    static async updatePairTokens(req: Request, res: Response) {
        try {
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const sessionService = new SessionService();

            const {refreshToken} = req.cookies
            if (!refreshToken) throw new Error;
            const isBlockedToken = await tokenService.checkTokenByBlackList(refreshToken)
            if (isBlockedToken) throw new Error;
            const payload = await tokenService.getPayloadByRefreshToken(refreshToken) as JWT
            if (!payload) throw new Error
            const user = await queryService.findUserByEmail(payload.email)
            if (user) {
                await tokenService.addTokenToBlackList(refreshToken)
                const updateSessionDevice = await sessionService.updateSession(payload.deviceId) as IDevice
                const newAccessToken = tokenService.generateAccessToken(TokenMapper.prepareAccessModel(user))
                const newRefreshToken = tokenService.generateRefreshToken(TokenMapper.prepareRefreshModel(user, updateSessionDevice))
                res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: true,
                        // maxAge: 24 * 60 * 60 * 1000
                    }
                );
                res.status(200).json({
                    "accessToken": newAccessToken
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }

    static async me(req: Request, res: Response) {
        try {
            const tokenService = new TokenService();
            const queryService = new QueryService();
            const token: string | undefined = req.headers.authorization?.split(' ')[1];
            if (token) {
                const payload = await tokenService.getPayloadByAccessToken(token) as JWT
                const user = await queryService.findUser(payload.id)
                res.status(200).json({
                    "email": user?.email,
                    "login": user?.login,
                    "userId": payload.id
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(401);
                console.log(error.message);
            }
        }
    }

    static async registration(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const {login, password, email} = req.body
            await userService.createByRegistration(login, password, email)

            res.sendStatus(204)
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(400);
                console.log(error.message);
            }
        }
    }

    static async confirmEmail(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const {code} = req.body;
            const confirmed = await userService.confirmUser(code);
            if (confirmed) res.sendStatus(204)
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(400);
                console.log(error.message);
            }
        }
    }

    static async resendConfirm(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const {email} = req.body
            await userService.resendConfirmByUser(email)
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(400);
                console.log(error.message);
            }
        }
    }

    static async recoveryPassword(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const {email} = req.body
            await userService.requestByRecovery(email)
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(400);
                console.log(error.message);
            }
        }
    }

    static async setupNewPassword(req: Request, res: Response) {
        try {
            const userService = new UserService();
            const {newPassword, recoveryCode} = req.body;
            await userService.confirmNewPassword(newPassword, recoveryCode);
            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(400);
                console.log(error.message);
            }
        }
    }
}

