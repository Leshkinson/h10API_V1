import nodemailer from "nodemailer";
import {Options} from "nodemailer/lib/mailer";

const host = "smtp.yandex.ru"
const EMAIL_ADDRESS = "lopatkool93oleg@yandex.ru"
const EMAIL_PASSWORD = "o1l9E9g3"

export class MailTransporter {
    private provider;

    constructor() {
        this.provider = nodemailer.createTransport(
            {
                host: `${host}`,
                port: 587, // 587
                secure: false, // true for 465, false for other ports
                auth: {
                    user: `${EMAIL_ADDRESS}`,
                    pass: `${EMAIL_PASSWORD}`
                }
            },
            {
                from: `Mailer Test <${EMAIL_ADDRESS}>`
            }
        )
    }

    public send(message: Options) {
        this.provider.sendMail(message, (err, info) => {
            if(err) return console.log(err.message)
            console.log('Email sent: ', info);
        })
    }
}