import {refreshTokenMetaCollection} from "./db";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesRepo = {
    async addRefreshTokenMeta(object: TypeRefreshTokenMeta) {
        await refreshTokenMetaCollection.insertOne(object)
    },
    async updateDateRefreshToken(deviceId:string): Promise<TypeRefreshTokenMeta> {
        return await refreshTokenMetaCollection.updateOne({deviceId}, {$set:{lastActiveDate:new Date()}})
    },
    async findRefreshTokenMetaByDeviceId(deviceId:string):Promise<TypeRefreshTokenMeta | null> {
        return await refreshTokenMetaCollection.findOne({deviceId})
    },
    async getAllRefreshTokenMeta():Promise<TypeRefreshTokenMeta[]> {
        return await  refreshTokenMetaCollection.find({}, {projection: {_id: 0, userId: 0}}).toArray();
    },
    async deleteAllDevicesExcludeCurrent(deviceId:string):Promise<boolean> {
        const result =  await refreshTokenMetaCollection.deleteMany({}, {$not:{deviceId}})
        return !! result.deletedCount
    },
    async deleteDeviceById(deviceId:string):Promise<boolean> {
        const result = await refreshTokenMetaCollection.deleteOne({deviceId})
        return !! result.deletedCount
    }
}
