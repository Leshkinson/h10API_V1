import {IDevice} from "../ts/interfaces";
import mongoose, {Schema} from "mongoose";

export const DeviceSchema = new Schema({
    ip: {type: "string", required: true},
    title: {type: "string", required: true},
    lastActiveDate: {type: "string", required: true},
    deviceId: {type: "string", required: true},
    userId: {type: "string", required: true},
}, {timestamps: true})

DeviceSchema.set('toJSON', {
    transform: function (doc, dto) {
        dto.id = dto._id;
        delete dto.id;
        delete dto._id;
        delete dto.__v;
        delete dto.updatedAt;
        delete dto.userId;
        delete dto.createdAt;
    }
});

DeviceSchema.set('id', true);

export const DeviceModel = mongoose.model<IDevice>('Device', DeviceSchema)