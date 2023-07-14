import {Request, Response, Router} from "express";
import {securityDevicesService} from "../service/securityDevicesService";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get("/devices",
    async (req:Request, res:Response) => {
    const arrayRefreshTokenMeta = await securityDevicesService.getAllDevices(req.cookies.refreshToken)
        if(arrayRefreshTokenMeta) {
            res.status(200).send(arrayRefreshTokenMeta)
        }
        else {
            res.sendStatus(401)
        }
    })

securityDevicesRouter.delete("/devices",
    async  (req:Request, res:Response) => {
    const deleteAllExcludeCurrent = await securityDevicesService.deleteAllDevicesExcludeCurrentService(req.cookies.refreshToken)
        if (deleteAllExcludeCurrent) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(401)
        }
    })

securityDevicesRouter.delete("/devices/deviceId",
    async (req:Request,res:Response) => {
    const deleteSuccess = await securityDevicesService.deleteDeviceByIdService(req.cookies.refreshToken)
        if(deleteSuccess) {
            res.sendStatus(403)
        }
        if(deleteSuccess === true) {
            res.sendStatus(204)
        }
        else{
            res.sendStatus(401)
        }
        if(deleteSuccess === null) {
            res.sendStatus(404)
        }
    }

)