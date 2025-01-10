export interface ICreds {
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
}

export class DbCreds<C extends ICreds> {
    DB_USER: string = "postgres"
    DB_PASSWORD: string = "test123"
    DB_HOST: string = "localhost"
    DB_PORT: number = 5432
    DB_NAME: string = "postgres"

    constructor(creds?: C) {
        this.DB_USER = creds?.DB_USER ?? this.DB_USER;
        this.DB_PASSWORD = creds?.DB_PASSWORD ?? this.DB_PASSWORD;
        this.DB_HOST = creds?.DB_HOST ?? this.DB_HOST;
        this.DB_PORT = creds?.DB_PORT ?? this.DB_PORT;
        this.DB_NAME = creds?.DB_NAME ?? this.DB_NAME;
    }
}