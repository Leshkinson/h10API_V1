import {MailTransporter} from "../config/mail-transporte";

export class MailService {
    private transporter: MailTransporter;

    constructor() {
        this.transporter = new MailTransporter()
    }

    public async sendConfirmMessage(to: string, code: string, sendMessage: Function): Promise<void> {
        this.transporter.send(sendMessage(to, code))
    }
}