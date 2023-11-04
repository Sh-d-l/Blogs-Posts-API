import {securityDevicesController} from "../composition-root";

import {Router} from "express";
export const securityDevicesRouter = Router({})

securityDevicesRouter.get("/devices",
    securityDevicesController.getAllDevices.bind(securityDevicesController) )

securityDevicesRouter.delete("/devices",
    securityDevicesController.deleteAllDevicesExcludeCurrent.bind(securityDevicesController) )

securityDevicesRouter.delete("/devices/:deviceId",
    securityDevicesController.deleteDeviceById.bind(securityDevicesController)

)