import {IUser} from "../ts/interfaces";
import {JwtPayload} from "jsonwebtoken";
import {UserModel} from "../models/user-model";
import {Model, RefType, SortOrder} from "mongoose";

export class UsersRepository {
    private userModel: Model<IUser>;

    constructor() {
        this.userModel = UserModel;
    }

    public async getAllUsers(
        sortBy: string = 'createdAt',
        sortDirection: SortOrder = 'desc',
        skip: number = 0,
        limit: number = 10,
        searchLoginTerm: { login: { $regex: RegExp } } | {} = {},
        searchEmailTerm: { email: { $regex: RegExp } } | {} = {},
    ): Promise<IUser[]> {

        return this.userModel.find({$or: [searchLoginTerm, searchEmailTerm]}).sort({[sortBy]: sortDirection}).skip(skip).limit(limit);
    }

    public async findUser(loginOrEmail: string): Promise<IUser | null> {
        return this.userModel.findOne({$or: [{"login": loginOrEmail}, {"email": loginOrEmail}]})
    }

    // public async findUserByParam(param: string): Promise<IUser | null> {
    //     return this.userModel.findOne({param})
    // }

    public async findUserByCode(code: string): Promise<IUser | null> {
        return this.userModel.findOne({"code": code})
    }

    public async findUserByEmail(email: string): Promise<IUser | null> {

        return this.userModel.findOne({"email": email})
    }

    public async findUserByLogin(login: string): Promise<IUser | null> {
        return this.userModel.findOne({"login": login})
    }

    public async updateUserByConfirmed(id: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate({_id: id}, {
            isConfirmed: true
        })
    }

    public async updateUserByNewPassword(id: string, newHashPassword: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate({_id: id}, {
            password: newHashPassword
        })
    }

    public async updateUserByCode(id: string, code: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate({_id: id}, {
            code: code
        })
    }

    public async findUserById(id: string | JwtPayload): Promise<IUser | null> {
        return this.userModel.findById({_id: id})
    }

    public async getUsersCount(searchLoginTerm: { login: { $regex: RegExp } } | {} = {}, searchEmailTerm: { email: { $regex: RegExp } } | {} = {}): Promise<number> {
        return this.userModel.countDocuments({$or: [searchLoginTerm, searchEmailTerm]});
    }

    public async createUser(login: string, password: string, email: string): Promise<IUser> {
        return await this.userModel.create({login, password, email, isConfirmed: true});
    }

    public async createUserByRegistration(login: string, password: string, email: string, code: string): Promise<IUser> {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5)
        return await this.userModel.create({login, password, email, code, isConfirmed: false, expirationDate})
    }

    public async deleteUser(id: RefType) {
        return this.userModel.findOneAndDelete({_id: id});
    }

    public async deleteAll() {
        return this.userModel.deleteMany();
    }
}