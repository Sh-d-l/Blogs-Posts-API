import {container} from "../composition-root";

import {Router} from "express";
import {SecurityDevicesController} from "../routers/securityDevicesRouter";
export const securityDevicesRouter = Router({})
const securityDevicesController = container.resolve(SecurityDevicesController)
securityDevicesRouter.get("/devices",
    securityDevicesController.getAllDevices.bind(securityDevicesController) )

securityDevicesRouter.delete("/devices",
    securityDevicesController.deleteAllDevicesExcludeCurrent.bind(securityDevicesController) )

securityDevicesRouter.delete("/devices/:deviceId",
    securityDevicesController.deleteDeviceById.bind(securityDevicesController)

)