declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    DATABASE_URL: string;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_URL: string;
  }
}

