import nodemailer from "nodemailer"

export const emailAdapter = {
    async transportEmailAdapter(mail:string):Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "incubatorBack@gmail.com",
                pass: "zpmltkbzcrkpfgsu"
            },
        });
        //console.log(transporter,"transporter")

        let info = await transporter.sendMail({
            from: "student",
            to: mail,
            subject: "Hello ✔",
            text: "babuka",
            html: "<b>Hello world?</b>",
        });
        console.log(info,"info")
        return !!info;

    }




}