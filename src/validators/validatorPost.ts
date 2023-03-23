import {Request,Response,NextFunction} from "express";
import {validationResult} from "express-validator";

export const inputValidator = (req:Request,res:Response,next:NextFunction) => {
    //debugger;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    next();
}