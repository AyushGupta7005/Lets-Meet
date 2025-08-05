import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as schemas from "@/db/schema"; // your schemas
import {
  githubClientId,
  githubClientSecret,
  googleClientId,
  googleClientSecret,
} from "../../env.config";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
    google: {
      enabled: true,
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
  database: drizzleAdapter(db, {
    schema: {
      ...schemas,
    },
    provider: "pg",
  }),
});
