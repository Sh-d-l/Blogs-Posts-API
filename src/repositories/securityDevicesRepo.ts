import {refreshTokenMetaCollection} from "./db";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesRepo = {
    async addRefreshTokenMeta(object: TypeRefreshTokenMeta) {
        await refreshTokenMetaCollection.insertOne(object)
    },
    async updateDateRefreshToken(deviceId:string) {
        await refreshTokenMetaCollection.updateOne({deviceId}, {$set:{lastActiveDate:new Date()}})
    }

}
