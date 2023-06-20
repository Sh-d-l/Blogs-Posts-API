import nodemailer from "nodemailer"

export const emailAdapter = {
    async transportEmailAdapter(mail: string):Promise<boolean> {
        let transporter = nodemailer.createTransport({
            //host: "smtp.gmail.com",
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
                text: "I hope this message gets delivered!",
                html: "<b>Hello world?</b>",
            },
        );
        return !!info;
    }
}



