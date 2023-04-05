import {IToken} from "../ts/interfaces";
import mongoose, {Schema} from "mongoose";

export const TokenSchema = new Schema({
    refreshToken: {type: "string", required: true},
}, {timestamps: true})

TokenSchema.set('toJSON', {
    transform: function (doc, dto) {
        dto.id = dto._id;
        delete dto._id;
        delete dto.__v;
        delete dto.updatedAt;
    }
});

TokenSchema.set('id', true);

export const TokenModel = mongoose.model<IToken>('Token', TokenSchema)