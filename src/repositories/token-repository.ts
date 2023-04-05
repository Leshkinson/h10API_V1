import {IToken} from "../ts/interfaces";
import {TokenModel} from "../models/token-model";
import {Model} from "mongoose";

export class TokenRepository {
    private tokenModel: Model<IToken>

    constructor() {
        this.tokenModel = TokenModel;
    }

    public async createToken(token: string): Promise<IToken> {
        return this.tokenModel.create({refreshToken: token})
    }

    public async findToken(token: string): Promise<IToken | null> {
        return this.tokenModel.findOne({"refreshToken": token})
    }
}