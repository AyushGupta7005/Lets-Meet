import dotenv from "dotenv";
dotenv.config();

export const databaseUrl = process.env.DATABASE_URL!;
export const githubClientId = process.env.GITHUB_CLIENT_ID!;
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET!;
export const googleClientId = process.env.GOOGLE_CLIENT_ID!;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
