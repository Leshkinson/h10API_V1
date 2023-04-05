import {v4 as uuidv4} from "uuid";
import {DeviceRepository} from "../repositories/device-repository";
import {IDevice} from "../ts/interfaces";

export class SessionService {
    private deviceRepository: DeviceRepository;

    constructor() {
        this.deviceRepository = new DeviceRepository()
    }
    public async generateSession(ip: string, title: string = 'unKnown', userId: string): Promise<IDevice> {
        const deviceId = uuidv4();
        return this.deviceRepository.createDeviceSession(ip, title, userId, new Date().toISOString(), deviceId)
    }

    public async findSession(deviceId: string): Promise<IDevice | null> {
        return this.deviceRepository.find(deviceId)
    }

    public async updateSession(deviceId: string): Promise<IDevice | null> {
        return this.deviceRepository.update(deviceId, new Date().toISOString())
    }

    public async getAllSessionByUser(userId: string): Promise<IDevice[] | null> {
        return this.deviceRepository.findAll(userId)
    }

    public async deleteSessionWithExcept(userId: string, deviceId: string): Promise<void> {
        await this.deviceRepository.deleteAllWithExcept(userId, deviceId)
    }

    public async deleteTheSession(userId: string, deviceId: string): Promise<void> {
        await this.deviceRepository.deleteOne(userId, deviceId)
    }
}