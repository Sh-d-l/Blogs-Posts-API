import {Request, Response, Router} from "express";
import {authRouter} from "../auth_API-Router/authRouter";
import nodemailer from "nodemailer"

authRouter.post("/send", async (req:Request,res:Response) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: "incubatorBack@gmail.com",
            pass: "Roger4000"
        },
    });
    console.log(transporter)

    let info = await transporter.sendMail({
        from: "incubatorBack@gmail.com", // sender address
        to: req.body.mail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "babuka", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    console.log(info)
   res.sendStatus(201)
})