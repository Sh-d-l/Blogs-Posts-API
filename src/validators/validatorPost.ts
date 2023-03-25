import {Request,Response,NextFunction} from "express";
import {validationResult} from "express-validator";
export const inputValidator = (req:Request,res:Response,next:NextFunction) => {
    //debugger;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    else {
        next();
    }
}




