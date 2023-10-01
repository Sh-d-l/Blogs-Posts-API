import nodemailer from "nodemailer"
import {TUsersWithHashEmailDb, TypeRecoveryCode} from "../types/types";

export const emailAdapter = {
    async transportEmailAdapter(email: string, user: TUsersWithHashEmailDb): Promise<boolean> {
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
                to: email,
                subject: "Send Email with confirmation code",
                text: "Send Email with confirmation code",
                html: '<p>You requested for email verification, kindly use this' +
                    ' <a href="https://google.com/confirm-email?code=' + user.emailConfirmation.confirmationCode
                    + '">' +   'link</a> to verify your email address</p>'
            }
        );
        return !!info;
    },

    async transportEmailAdapterPasswordRecovery(email:string,recoveryCode:TypeRecoveryCode): Promise<boolean> {
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
                to: email,
                subject: "Send Email with recoveryCode",
                text: "Send Email with recoveryCode",
                html: '<p>To finish password recovery please follow the link below:' +
        '<a href="https://somesite.com/password-recovery?recoveryCode=' + recoveryCode.recoveryCode +'" >'
                    + 'link</a>recoveryCode</p>'
            }
        );
        return !!info;
    }
}



