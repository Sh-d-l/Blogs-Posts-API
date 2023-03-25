import {Request,Response,NextFunction} from "express";
export const basicAuth = ((req:Request,res:Response,next:NextFunction) => {
    if(req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
    }
    else{
        next()
    }
})