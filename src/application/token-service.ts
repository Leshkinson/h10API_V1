import jwt, {JwtPayload, Secret, SignOptions} from "jsonwebtoken";
import {IToken} from "../ts/interfaces";
import {TokenRepository} from "../repositories/token-repository";

const settings = {
    JWT_ACCESS_SECRET: "superpupersecret",
    JWT_REFRESH_SECRET: "superpupermegasecret",
    TOKEN_ACCESS_LIVE_TIME: {expiresIn: "10s"},
    TOKEN_REFRESH_LIVE_TIME: {expiresIn: "100s"},
}

export interface JWT extends JwtPayload {
    id: string;
    email: string;
    deviceId: string;
}

export class TokenService {
    private tokenRepository: TokenRepository
    private readonly secretAccess: Secret;
    private readonly optionsAccess: SignOptions;
    private readonly secretRefresh: Secret;
    private readonly optionsRefresh: SignOptions;

    
    constructor() {
        this.tokenRepository = new TokenRepository();
        this.optionsAccess = settings.TOKEN_ACCESS_LIVE_TIME;
        this.secretAccess = settings.JWT_ACCESS_SECRET;
        this.optionsRefresh = settings.TOKEN_REFRESH_LIVE_TIME;
        this.secretRefresh = settings.JWT_REFRESH_SECRET;
    }

    public generateAccessToken(payload: object): string {
        return jwt.sign(payload, this.secretAccess, this.optionsAccess);
    }

    public generateRefreshToken(payload: object):string {
        return jwt.sign(payload, this.secretRefresh, this.optionsRefresh);
    }

    public getPayloadByAccessToken(token: string): string | JwtPayload | JWT | boolean {
        const {exp} = jwt.decode(token) as JwtPayload
        if (!exp) return false
        if (Date.now() >= exp * 1000) {
            return false
        }

        return jwt.verify(token, settings.JWT_ACCESS_SECRET)

    }

    public getPayloadByRefreshToken(token: string): string | JwtPayload | JWT | boolean {
        const {exp} = jwt.decode(token) as JwtPayload
        if (!exp) return false
        if (Date.now() >= exp * 1000) {
            return false
        }
        return jwt.verify(token, settings.JWT_REFRESH_SECRET)
    }

    public async addTokenToBlackList(token: string): Promise<IToken> {
        return await this.tokenRepository.createToken(token)
    }

    public async checkTokenByBlackList(token: string): Promise<boolean> {
        const checkToken = await this.tokenRepository.findToken(token)
        return !!checkToken;
    }
}