//import {securityDevicesRepo} from "../repositories/securityDevicesRepo";
import {jwtService} from "../application/jwt-service";
import {TypeRefreshTokenMeta} from "../types/types";
import {SecurityDevicesRepo} from "../repositories/securityDevicesRepo";
import {securityDevicesRepo} from "../composition-root";
import {Router} from "express";


export class SecurityDevicesService {
    constructor(protected securityDevicesRepo:SecurityDevicesRepo) {
    }
    async getAllDevicesByUserId(refreshToken:string):Promise<TypeRefreshTokenMeta[] | null> {
        if (!refreshToken) return null;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return null;
        const refreshTokenMetaObject = await this.securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if(!refreshTokenMetaObject) return null;
        if(new Date (payloadArray[1]).getTime() === new Date(refreshTokenMetaObject.lastActiveDate).getTime()
            && payloadArray[2] === refreshTokenMetaObject.userId) {
            return await this.securityDevicesRepo.getAllRefreshTokenMeta(payloadArray[2])
        }
        else return null
    }

    async deleteAllDevicesExcludeCurrentService(refreshToken:string):Promise<boolean> {
        if (!refreshToken) return false;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return false;
        const refreshTokenMetaObject = await this.securityDevicesRepo.findRefreshTokenMetaByDeviceId(payloadArray[0])
        if (!refreshTokenMetaObject) return false;
        if (new Date (payloadArray[1]).getTime() == new Date(refreshTokenMetaObject.lastActiveDate).getTime()) {
            return await this.securityDevicesRepo.deleteAllDevicesExcludeCurrent(payloadArray[0])
        }
        else return false
    }

    async deleteDeviceByIdService(deviceId:string, refreshToken:string): Promise<number> {
        if (!refreshToken) return 401;
        const payloadArray = await jwtService.getPayloadRefreshToken(refreshToken)
        if (!payloadArray) return 401;
        const refreshTokenMetaObject = await this.securityDevicesRepo.findRefreshTokenMetaByDeviceId(deviceId)
        if(!refreshTokenMetaObject) return 404
        if(refreshTokenMetaObject?.userId !== payloadArray[2]) return 403
        const deleteSuccess = await this.securityDevicesRepo.deleteDeviceByDeviceId(deviceId)
        if(deleteSuccess) return 204
        else return 404

    }
}


