import {IUser} from "../ts/interfaces";
import mongoose, {Schema} from "mongoose";

export const UserSchema = new Schema({
    login: {type: "string", required: true},
    email: {type: "string", required: true},
    password: {type: "string", required: true},
    isConfirmed: {type: "boolean", required: false},
    code: {type: "string", required: false},
    expirationDate: {type: "Date", required: false}
}, {timestamps: true})

UserSchema.set('toJSON', {
    transform: function (doc, dto) {
        dto.id = dto._id;
        delete dto._id;
        delete dto.__v;
        delete dto.updatedAt;
        delete dto.password;
        delete dto.isConfirmed;
        delete dto.code;
    }
});

UserSchema.set('id', true);

export const UserModel = mongoose.model<IUser>('User', UserSchema);