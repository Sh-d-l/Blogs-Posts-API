import {RefreshTokenMetaModel, RefreshTokenMetaSchema} from "../mongoDB/db";
import {TypeRefreshTokenMeta} from "../types/types";
import {Schema} from "mongoose";

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
    async getAllRefreshTokenMeta(_id:Schema.Types.ObjectId):Promise<TypeRefreshTokenMeta[]> {
        return RefreshTokenMetaModel.find({_id}, {projection: {_id: 0, userId: 0}});
    },
    async deleteAllDevicesExcludeCurrent(_id:Schema.Types.ObjectId):Promise<boolean> {
        const result =  await RefreshTokenMetaModel.deleteMany({deviceId: {$nin:[_id]}})
        return !! result
    },
    async deleteDeviceByDeviceId(deviceId:string):Promise<boolean> {
        const result = await RefreshTokenMetaModel.findOne({deviceId})
        return !! result
    }
}
