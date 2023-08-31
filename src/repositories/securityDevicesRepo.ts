import {refreshTokenMetaCollection} from "../mongoDB/db";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesRepo = {
    async addRefreshTokenMeta(object: TypeRefreshTokenMeta) {
        await refreshTokenMetaCollection.insertOne(object)
    },
    async updateDateRefreshToken(deviceId:string) {
        await refreshTokenMetaCollection.updateOne({deviceId}, {$set:{lastActiveDate:new Date()}})
    },
    async findRefreshTokenMetaByDeviceId(deviceId:string):Promise<TypeRefreshTokenMeta | null> {
        return await refreshTokenMetaCollection.findOne({deviceId},{projection: {_id: 0}})
    },
    async getAllRefreshTokenMeta(userId:string):Promise<TypeRefreshTokenMeta[]> {
        return await  refreshTokenMetaCollection.find({userId:userId}, {projection: {_id: 0, userId: 0}}).toArray();
    },
    async deleteAllDevicesExcludeCurrent(id:string):Promise<boolean> {
        const result =  await refreshTokenMetaCollection.deleteMany({deviceId: {$nin:[id]}})
        return !! result.deletedCount
    },
    async deleteDeviceById(deviceId:string):Promise<boolean> {
        const result = await refreshTokenMetaCollection.deleteOne({deviceId:deviceId})
        return !! result.deletedCount
    }
}
