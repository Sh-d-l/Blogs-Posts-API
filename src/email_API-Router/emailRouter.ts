import {Request, Response, Router} from "express";
import {authRouter} from "../auth_API-Router/authRouter";
import nodemailer from "nodemailer"

authRouter.post("/:registration", async (req:Request,res:Response) => {
    const mail = await emailAdapters.sendEmail(req.)


    let transporter = nodemailer.createTransport({
        host: "gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "incubatorBack@gmail.com",
            pass: "Roger4000"
        },
    });
    console.log(transporter)

    let info = await transporter.sendMail({
        from: '"student>', // sender address
        to: req.body.mail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: req.body.text, // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    console.log(info)
   res.sendStatus(201)
})