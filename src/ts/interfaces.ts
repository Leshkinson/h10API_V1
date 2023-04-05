import mongoose from "mongoose";

export interface IBlog {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
}

export interface IPost {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    login: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    code: string;
    expirationDate: Date;
}

export interface IComment {
    _id: mongoose.Schema.Types.ObjectId;
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string,
    }
}

export interface IToken {
    _id: mongoose.Schema.Types.ObjectId;
    token: string
}

export interface IDevice {
    _id: mongoose.Schema.Types.ObjectId;
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
    userId: string,
}