import {IDevice} from "../ts/interfaces";
import {Model} from "mongoose";
import {DeviceModel} from "../models/device-session-model";

export class DeviceRepository {
    private deviceModel: Model<IDevice>

    constructor() {
        this.deviceModel = DeviceModel
    }

    public async createDeviceSession(ip: string, title: string, userId: string, date: string, deviceId: string): Promise<IDevice> {
        return await this.deviceModel.create({ip, title, userId, lastActiveDate: date, deviceId})
    }

    public async find(deviceId: string): Promise<IDevice | null> {
        return this.deviceModel.findOne({'deviceId': deviceId});
    }

    public async update(deviceId: string, date: string): Promise<IDevice | null> {
        return this.deviceModel.findOneAndUpdate({'deviceId': deviceId}, {
            'lastActiveDate': date
        });
    }

    public async findAll(userId: string): Promise<IDevice[] | null> {
        return this.deviceModel.find({userId: userId})
    }

    public async deleteAllWithExcept(userId: string, deviceId: string): Promise<void> {
        await this.deviceModel.deleteMany({$and:[{userId: userId}, {deviceId: {$ne:deviceId}}]})
    }

    public async deleteOne(userId: string, deviceId: string): Promise<void> {
        await this.deviceModel.deleteOne({$and:[{userId: userId}, {deviceId: deviceId}]})
    }

}