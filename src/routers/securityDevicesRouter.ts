import {Request, Response} from "express";
import {SecurityDevicesService} from "../service/securityDevicesService";

export class SecurityDevicesController{
    constructor(protected securityDevicesService:SecurityDevicesService) {
    }
    async getAllDevices(req:Request, res:Response){
        const arrayRefreshTokenMeta = await this.securityDevicesService.getAllDevicesByUserId(req.cookies.refreshToken)
        if(arrayRefreshTokenMeta) {
            res.status(200).send(arrayRefreshTokenMeta)
        }
        else {
            res.sendStatus(401)
        }
    }
    async deleteAllDevicesExcludeCurrent(req:Request, res:Response){
        const deleteAllExcludeCurrent = await this.securityDevicesService.deleteAllDevicesExcludeCurrentService(req.cookies.refreshToken)
        if (deleteAllExcludeCurrent) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(401)
        }
    }
    async deleteDeviceById(req:Request, res:Response) {
        const deleteSuccess = await this.securityDevicesService.deleteDeviceByIdService(req.params.deviceId, req.cookies.refreshToken)
        if (deleteSuccess === 204) {
            res.sendStatus(204)
            return
        }
        if (deleteSuccess === 401) {
            res.sendStatus(401)
            return
        }
        if (deleteSuccess === 403) {
            res.sendStatus(403)
            return
        }
        if (deleteSuccess === 404) {
            res.sendStatus(404)
            return
        }
    }
}

