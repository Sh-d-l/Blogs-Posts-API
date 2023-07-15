import {securityDevicesRepo} from "../repositories/securityDevicesRepo";
import {jwtService} from "../application/jwt-service";
import {TypeRefreshTokenMeta} from "../types/types";

export const securityDevicesService = {

    async getAllDevices(refreshToken:string):Promise<TypeRefreshTokenMeta[] | null> {
        if (!refreshToken) return null;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return null;
        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if(refreshTokenMetaObject && payloadArray[1] == refreshTokenMetaObject.lastActiveDate) {
            return await securityDevicesRepo.getAllRefreshTokenMeta()
        }
        else return null
    },

    async deleteAllDevicesExcludeCurrentService(refreshToken:string):Promise<boolean> {
        if (!refreshToken) return false;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return false;
        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if(refreshTokenMetaObject && payloadArray[1] == refreshTokenMetaObject.lastActiveDate) {
            return await securityDevicesRepo.deleteAllDevicesExcludeCurrent(payloadArray[0])
        }
        else return false

    },

    async deleteDeviceByIdService(refreshToken:string): Promise<boolean | null |TypeRefreshTokenMeta> {
        if (!refreshToken) return false;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return false;
        const refreshTokenMetaObject = await securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if(refreshTokenMetaObject?.userId !== payloadArray[2] ) return refreshTokenMetaObject
        if(refreshTokenMetaObject && payloadArray[1] == refreshTokenMetaObject.lastActiveDate) {
             await securityDevicesRepo.deleteDeviceById(payloadArray[0])
            return true
        }
        else return null
    }
}