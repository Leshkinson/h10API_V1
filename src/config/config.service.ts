import dotenv from "dotenv";
//import {UserEntity} from "../entity/user.entity";
//import {TokenEntity} from "../entity/token.entity";
//import {StrategyOptions} from "passport-google-oauth20";
//import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
//import {Secret, SignOptions} from "jsonwebtoken";
//import SMTPTransport from "nodemailer/lib/smtp-transport";



dotenv.config();

// const POSTGRES_ENVIRONMENT_CFG = {
//     POSTGRES_HOST: "POSTGRES_HOST",
//     POSTGRES_PORT: "POSTGRES_PORT",
//     POSTGRES_USER: "POSTGRES_USER",
//     POSTGRES_PASSWORD: "POSTGRES_PASSWORD",
//     POSTGRES_DATABASE: "POSTGRES_DATABASE"
// } as const;
//
// const AUTH_ENVIRONMENT_CFG = {
//     JWT_ACCESS_SECRET: "JWT_ACCESS_SECRET",
//     TOKEN_LIVE_TIME: "TOKEN_LIVE_TIME"
// } as const;
//
// const GOOGLE_ENVIRONMENT_CFG = {
//     GOOGLE_CLIENT_ID: "GOOGLE_CLIENT_ID",
//     GOOGLE_CLIENT_SECRET: "GOOGLE_CLIENT_SECRET",
//     CALL_BACK_URL: "CALL_BACK_URL",
// } as const;
//
// const MAILER_ENVIRONMENT_CFG = {
//     SMTP_HOST: "SMTP_HOST",
//     SMTP_PORT: "SMTP_PORT",
//     EMAIL_ADDRESS: "EMAIL_ADDRESS",
//     EMAIL_PASSWORD: "EMAIL_PASSWORD",
// } as const;
//
// const SERVER_ENVIRONMENT_CFG = {
//     PORT: "PORT",
//     MODE: "MODE",
// } as const;
//
// const CLIENT_ENVIRONMENT_CFG = {
//     CLIENT_URL: "CLIENT_URL",
// } as const;
//
// type EnsureEnvironmentCfgKeys = keyof typeof POSTGRES_ENVIRONMENT_CFG;
// type EnsureEnvironmentCfgValues = typeof POSTGRES_ENVIRONMENT_CFG[EnsureEnvironmentCfgKeys];
//
// type AuthEnvironmentCfgKeys = keyof typeof AUTH_ENVIRONMENT_CFG;
// type AuthEnvironmentCfgValues = typeof AUTH_ENVIRONMENT_CFG[AuthEnvironmentCfgKeys];
//
// type GoogleEnvironmentCfgKeys = keyof typeof GOOGLE_ENVIRONMENT_CFG;
// type GoogleEnvironmentCfgValues = typeof GOOGLE_ENVIRONMENT_CFG[GoogleEnvironmentCfgKeys];
//
// type MailerEnvironmentCfgKeys = keyof typeof MAILER_ENVIRONMENT_CFG;
// type MailerEnvironmentCfgValues = typeof MAILER_ENVIRONMENT_CFG[MailerEnvironmentCfgKeys];
//
// type ServerEnvironmentCfgKeys = keyof typeof SERVER_ENVIRONMENT_CFG;
// type ServerEnvironmentCfgValues = typeof SERVER_ENVIRONMENT_CFG[ServerEnvironmentCfgKeys];
//
// type ClientEnvironmentCfgKeys = keyof typeof CLIENT_ENVIRONMENT_CFG;
// type ClientEnvironmentCfgValues = typeof CLIENT_ENVIRONMENT_CFG[ClientEnvironmentCfgKeys];
//
// type ConfigTypes = EnsureEnvironmentCfgValues | AuthEnvironmentCfgValues | GoogleEnvironmentCfgValues | MailerEnvironmentCfgValues | ServerEnvironmentCfgValues | ClientEnvironmentCfgValues;

type ProcessEnvKeys = keyof NodeJS.ProcessEnv;

interface Value {
    key: ProcessEnvKeys;
    throwOnMissing: boolean;
}

class ConfigService {
    constructor(private env: NodeJS.ProcessEnv) {
    }

    SECURE_MAILER_PORT = 465;

    private getValue({key, throwOnMissing = true}: Value): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return <string>value;
    }

    public ensureValues(keys: ProcessEnvKeys[]): ConfigService {
        keys.forEach(key => this.getValue({key, throwOnMissing: true}));
        return this;
    }

    public getPort(): string  {
        return this.getValue({key: "PORT", throwOnMissing: true});
    }

    public isProduction(): boolean {
        return this.getValue({key: "MODE", throwOnMissing: false}) === "production";
    }

    public getDbURL(): string {
        return this.getValue({key: "DB_URL", throwOnMissing: true})
    }

    // public getTypeOrmConfig(): PostgresConnectionOptions {
    //     return {
    //         type: "postgres",
    //
    //         host: this.getValue({key:"POSTGRES_HOST", throwOnMissing: true}),
    //         port: parseInt(this.getValue({key:"POSTGRES_PORT", throwOnMissing: true})),
    //         username: this.getValue({key: "POSTGRES_USER", throwOnMissing: true}),
    //         password: this.getValue({key: "POSTGRES_PASSWORD", throwOnMissing: true}),
    //         database: this.getValue({key: "POSTGRES_DATABASE", throwOnMissing: true}),
    //
    //         entities: this.getEntitiesArray(),
    //         //entities: ["dist/entity/*{.js,.ts}"],
    //
    //         migrationsTableName: "migration",
    //
    //         migrations: ["dist/migration/*{.js,.ts}"],
    //
    //         migrationsRun: true,
    //         synchronize: true,
    //
    //         ssl: this.isProduction()
    //     };
    // }

    // public getEntitiesArray() {
    //     return [
    //         UserEntity,
    //         TokenEntity,
    //     ];
    // }

    // public getAuthConfig(): {secret: Secret, signOptions: SignOptions} {
    //     return {
    //         secret: this.getValue({key: "JWT_ACCESS_SECRET", throwOnMissing: true}),
    //         signOptions: {
    //             expiresIn: `${parseInt(this.getValue({key: "TOKEN_LIVE_TIME", throwOnMissing: true}))}s`
    //         }
    //     };
    // }

    // public getAuthSecret(): string {
    //     return this.getValue({key: "JWT_ACCESS_SECRET", throwOnMissing: true})
    // }
    //
    // public getClientUrl(): string {
    //     return this.getValue({key: "CLIENT_URL", throwOnMissing: true})
    // }

    // public getMailerConfig(): SMTPTransport.Options {
    //     return {
    //         host: this.getValue({key: "SMTP_HOST", throwOnMissing: true}),
    //         port: Number(this.getValue({key: "SMTP_PORT", throwOnMissing: true})),
    //         secure: this.isSecureMailerConnection(),
    //         auth: {
    //             user: this.getValue({key: "EMAIL_ADDRESS", throwOnMissing: true}),
    //             pass: this.getValue({key: "EMAIL_PASSWORD", throwOnMissing: true})
    //         }
    //     }
    // }

    // public getGoogleStrategyConfig(): StrategyOptions {
    //     return {
    //         clientID: this.getValue({key: "GOOGLE_CLIENT_ID", throwOnMissing: true}),
    //         clientSecret: this.getValue({key: "GOOGLE_CLIENT_SECRET", throwOnMissing: true}),
    //         callbackURL: this.getValue({key: "CALL_BACK_URL", throwOnMissing: true}),
    //         passReqToCallback: false,
    //         scope: ["email", "profile"]
    //     }
    // }

    // public isSecureMailerConnection(): boolean {
    //     return Number(this.getValue({key: "SMTP_PORT", throwOnMissing: true})) === this.SECURE_MAILER_PORT;
    // }
    //
    // public getMailerOwner(): SMTPTransport.Options {
    //     return {
    //         from: `Mailer Test <${process.env.EMAIL_ADDRESS}>`
    //     }
    // }
}

// const databaseConfigService: ConfigService = new ConfigService(process.env)
//     .ensureValues([
//         "POSTGRES_HOST",
//         "POSTGRES_PORT",
//         "POSTGRES_USER",
//         "POSTGRES_PASSWORD",
//         "POSTGRES_DATABASE",
//     ]);

// const authConfigService: ConfigService = new ConfigService(process.env)
//     .ensureValues([
//         "JWT_ACCESS_SECRET",
//         "TOKEN_LIVE_TIME"
//     ]);

// const mailerConfigService: ConfigService = new ConfigService(process.env)
//     .ensureValues([
//         "SMTP_HOST",
//         "SMTP_PORT",
//         "EMAIL_ADDRESS",
//         "EMAIL_PASSWORD",
//     ]);

// const googleConfigService: ConfigService  = new ConfigService(process.env)
//     .ensureValues([
//     "GOOGLE_CLIENT_ID",
//     "GOOGLE_CLIENT_SECRET",
//     "CALL_BACK_URL",
// ])

// const clientConfigService: ConfigService = new ConfigService(process.env)
//     .ensureValues(["CLIENT_URL"])

const serverConfigService: ConfigService = new ConfigService(process.env)
    .ensureValues([
        "PORT",
        "DB_URL"
    ])
export {
    // databaseConfigService,
    // authConfigService,
    // mailerConfigService,
    // googleConfigService,
    // clientConfigService,
    serverConfigService,
};