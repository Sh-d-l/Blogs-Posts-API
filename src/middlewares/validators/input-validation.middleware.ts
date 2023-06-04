import {Request,Response,NextFunction} from "express";
import {validationResult} from "express-validator";

export const inputValidator = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError: true}).map(el => ({
            message: el.msg,
            field: el.param
        }))
         res.status(400).json({ errorsMessages });

        return
    }
        next();

}




