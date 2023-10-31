import {securityDevicesController} from "../composition-root";

import {Router} from "express";
import {securityDevicesRouter} from "../routers/securityDevicesRouter";


securityDevicesRouter.get("/devices",
    securityDevicesController.getAllDevices.bind(securityDevicesController) )

securityDevicesRouter.delete("/devices",
    securityDevicesController.deleteAllDevicesExcludeCurrent.bind(securityDevicesController) )

securityDevicesRouter.delete("/devices/:deviceId",
    securityDevicesController.deleteDeviceById.bind(securityDevicesController)

)