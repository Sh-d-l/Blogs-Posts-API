import {securityDevicesRepo} from "../repositories/securityDevicesRepo";
import {jwtService} from "../application/jwt-service";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesService = {

    async getAllDevices(refreshToken:string):Promise<TypeRefreshTokenMeta[] | null> {
        if (!refreshToken) return null;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return null;
        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if(!refreshTokenMetaObject) return null;
        if(new Date (payloadArray[1]).getTime() == new Date(refreshTokenMetaObject.lastActiveDate).getTime()) {
            return await securityDevicesRepo.getAllRefreshTokenMeta()
        }
        else return null
    },

    async deleteAllDevicesExcludeCurrentService(refreshToken:string):Promise<boolean> {
        if (!refreshToken) return false;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return false;
        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if(!refreshTokenMetaObject) return false;
        if(new Date (payloadArray[1]).getTime() == new Date(refreshTokenMetaObject.lastActiveDate).getTime()) {
            return await securityDevicesRepo.deleteAllDevicesExcludeCurrent(payloadArray[0])
        }
        else return false
    },

    async deleteDeviceByIdService(deviceId:string, refreshToken:string): Promise<number> {
        if (!refreshToken) return 401;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return 401;
        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(deviceId)
        if(refreshTokenMetaObject?.userId !== payloadArray[2] )  return 403
        //if(refreshTokenMetaObject && new Date (payloadArray[1]).getTime() !== new Date(refreshTokenMetaObject.lastActiveDate).getTime()) return 401

        const deleteSuccess = await securityDevicesRepo.deleteDeviceById(deviceId)
        if(deleteSuccess) return 204
        else return 404
    }
}