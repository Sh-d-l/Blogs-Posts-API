import {Request, Response, Router} from "express";
import {securityDevicesService} from "../service/securityDevicesService";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get("/devices",
    async (req:Request, res:Response) => {
    const arrayRefreshTokenMeta = await securityDevicesService.getAllDevicesByUserId(req.cookies.refreshToken)
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

securityDevicesRouter.delete("/devices/:deviceId",
    async (req:Request,res:Response) => {
    const deleteSuccess = await securityDevicesService.deleteDeviceByIdService(req.params.deviceId, req.cookies.refreshToken)
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

)