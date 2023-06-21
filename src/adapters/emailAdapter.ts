import nodemailer from "nodemailer"
import {TUsersWithHashEmailDb} from "../users_API-repositories/users_API-repositories-db";


export const emailAdapter = {
    async transportEmailAdapter(mail: string, user:TUsersWithHashEmailDb):Promise<boolean> {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "incubatorBack@gmail.com",
                pass: "zpmltkbzcrkpfgsu"
            },
        });
        let info = await transporter.sendMail(
            {
                from: "incubatorBack@gmail.com",
                to: mail,
                subject: "Testing Message Message",
                text: user.emailConfirmation.confirmationCode,
                html: <a> "https://some-front.com/confirm-registration?code=${user.emailConfirmation.confirmationCode}"</a>,
            },
        );
        return !!info;
    }
}



