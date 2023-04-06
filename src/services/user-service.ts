import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {IUser} from "../ts/interfaces";
import {RefType, SortOrder} from "mongoose";
import {MailService} from "../application/mail-service";
import {UsersRepository} from "../repositories/users-repository";
import {passwordConfirmedTemplate, userInvitationTemplate} from "../templates/mail-templates/user-invitation";

export class UserService {
    private userRepository: UsersRepository;

    constructor() {
        this.userRepository = new UsersRepository()
    }

    public async getAll(
        sortBy: string = 'createdAt',
        sortDirection: SortOrder | undefined = 'desc',
        pageNumber: number = 1,
        pageSize: number = 10,
        searchLoginTerm: { login: { $regex: RegExp } } | {} = {},
        searchEmailTerm: { email: { $regex: RegExp } } | {} = {}
    ): Promise<IUser[]> {
        if (searchLoginTerm) searchLoginTerm = {login: {$regex: new RegExp(`.*${searchLoginTerm}.*`, 'i')}};
        if (searchEmailTerm) searchEmailTerm = {email: {$regex: new RegExp(`.*${searchEmailTerm}.*`, 'i')}};

        const skip: number = Number((pageNumber - 1) * pageSize);

        return await this.userRepository.getAllUsers(sortBy, sortDirection, skip, pageSize, searchLoginTerm, searchEmailTerm);
    }

    public async create(login: string, password: string, email: string): Promise<IUser> {
        const hashPassword = await bcrypt.hash(password, 5);

         const a = await this.userRepository.createUser(login, hashPassword, email)
        console.log('user a service', a)
        return a
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findUserByEmail(email)
    }

    public async findByLogin(login: string): Promise<IUser | null> {
        return this.userRepository.findUserByLogin(login)
    }

    public async findByCode(code: string): Promise<IUser | null> {
        return await this.userRepository.findUserByCode(code)
    }

    // public async findBy(param: string): Promise<IUser | null> {
    //     return await this.userRepository.findUserByParam(param)
    // }

    public async createByRegistration(login: string, password: string, email: string): Promise<IUser | null> {
        const hashPassword = await bcrypt.hash(password, 5);
        const code = uuidv4();
        const user = await this.userRepository.createUserByRegistration(login, hashPassword, email, code)
        try {
            const mailService = new MailService()
            await mailService.sendConfirmMessage(email, code, userInvitationTemplate);
        } catch (error) {
            if (error instanceof Error) {
                await this.userRepository.deleteUser((user._id).toString())
                console.log(error.message);
                return null
            }
        }

        return user
    }

    public async confirmUser(code: string): Promise<boolean | null| IUser> {
        const user = await this.userRepository.findUserByCode(code);
        if (!user) return false;
        if (new Date(user.expirationDate).getTime() > new Date().getTime()) {
            return await this.userRepository.updateUserByConfirmed((user._id).toString())
        }
        await this.userRepository.deleteUser((user._id).toString());

        return false
    }

    public async confirmNewPassword(newPassword: string, recoveryCode: string): Promise<boolean | null| IUser> {
        const hashNewPassword = await bcrypt.hash(newPassword, 5);
        const user = await this.userRepository.findUserByCode(recoveryCode);
        if (!user) return false;
        return await this.userRepository.updateUserByNewPassword((user._id).toString(), hashNewPassword);
    }

    public async resendConfirmByUser(email: string): Promise<void> {
        const mailService = new MailService();
        const user = await this.userRepository.findUserByEmail(email);
        if (user) {
            const code = uuidv4();
            await this.userRepository.updateUserByCode((user._id).toString(), code);
            await mailService.sendConfirmMessage(email, code, userInvitationTemplate);
        }
    }

    public async requestByRecovery (email: string) {
        const mailService = new MailService()
        const user = await this.userRepository.findUserByEmail(email)
        if(user && user.isConfirmed) {
            const recoveryCode = uuidv4();
            await this.userRepository.updateUserByCode((user._id).toString(), recoveryCode);
            await mailService.sendConfirmMessage(email, recoveryCode, passwordConfirmedTemplate)
        }
    }



    public async delete(id: RefType): Promise<IUser> {
        const deleteUser = await this.userRepository.deleteUser(id);
        if (deleteUser) return deleteUser;
        throw new Error();
    }

    public async testingDelete(): Promise<void> {
        await this.userRepository.deleteAll();
    }

    public async verifyUser(loginOrEmail: string, password: string): Promise<IUser> {
        const consideredUser = await this.userRepository.findUser(loginOrEmail);
        if (!consideredUser) throw new Error();
        if (await bcrypt.compare(password, consideredUser.password)) return consideredUser;

        throw new Error();
    }
}