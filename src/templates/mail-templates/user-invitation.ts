interface UserInvitation {
    to: string,
    html: string
}

export function userInvitationTemplate(mail: string, code: string): UserInvitation {
    return {
        to: mail,
        html: `
        <h1>Thank for your registration!</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>`
    }
}

export function passwordConfirmedTemplate(mail: string, code: string): UserInvitation {
    return {
        to: mail,
        html: `
        <h1>Thank for your registration!</h1>
    <p>To finish password recovery please follow the link below:
        <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
    </p>`
    }
}