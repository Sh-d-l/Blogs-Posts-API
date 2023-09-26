import {RefreshTokenMetaModel} from "../mongoDB/db";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesRepo = {
    async addRefreshTokenMeta(object: TypeRefreshTokenMeta) {
        await RefreshTokenMetaModel.create(object)
    },
    async updateDateRefreshToken(deviceId:string) {
        await RefreshTokenMetaModel.updateOne({deviceId}, {lastActiveDate:new Date()})
    },
    async findRefreshTokenMetaByDeviceId(deviceId:string):Promise<TypeRefreshTokenMeta | null> {
        return RefreshTokenMetaModel.findOne({deviceId},{projection: {_id: 0}})
    },
    async getAllRefreshTokenMeta(userId:string):Promise<TypeRefreshTokenMeta[]> {
        return RefreshTokenMetaModel.find({userId}, {projection: {_id: 0, userId: 0}}).lean();
    },
    async deleteAllDevicesExcludeCurrent(deviceId:string):Promise<boolean> {
        const result =  await RefreshTokenMetaModel.deleteMany({deviceId: {$nin:[deviceId]}})
        return !! result
    },
    async deleteDeviceByDeviceId(deviceId:string):Promise<boolean> {
        const result = await RefreshTokenMetaModel.deleteOne({deviceId})
        return !! result
    }
}
