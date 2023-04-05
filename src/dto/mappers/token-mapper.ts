import {IUser, IDevice} from "../../ts/interfaces";

export class TokenMapper {
    public static prepareAccessModel(model: IUser) {
        return {
            id: model._id
        }
    }

    public static prepareRefreshModel(model: IUser, model2: IDevice) {
        return {
            id: model._id,
            email: model.email,
            deviceId: model2.deviceId
        }
    }
}