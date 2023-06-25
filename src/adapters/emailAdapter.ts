import nodemailer from "nodemailer"
import {TUsersWithHashEmailDb} from "../types/types";
import {UpdateResult} from "mongodb";

export const emailAdapter = {
    async transportEmailAdapterRegistration(mail: string, user: TUsersWithHashEmailDb): Promise<boolean> {
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
                subject: "Send Email with confirmation code",
                text: "Send Email with confirmation code",
                html: '<p>You requested for email verification, kindly use this <a href="https://google.com/confirm-email?code=' + user.emailConfirmation.confirmationCode + '">link</a> to verify your email address</p>'
            }
        );
        return !!info;
    },
    async transportEmailAdapterResending(mail: string, user: TUsersWithHashEmailDb): Promise<boolean> {
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
                subject: "Resending Email with confirmation code",
                text: "Resending Email with confirmation code",
                html: '<p>You requested for email verification, kindly use this <a href="https://google.com/confirm-email?code=' + user.emailConfirmation.confirmationCode + '">link</a> to verify your email address</p>'
            }
        );
        return !!info;
    }
}



