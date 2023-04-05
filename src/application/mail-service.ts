import {MailTransporter} from "../config/mail-transporte";
import {userInvitationTemplate} from "../templates/mail-templates/user-invitation";

export class MailService {
    async sendConfirmMessageToEmail(to: string, code: string) {
        let sendMessage = userInvitationTemplate(to, code)
        const transporter = new MailTransporter()
        transporter.send(sendMessage)
    }
}