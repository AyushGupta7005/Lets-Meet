import { drizzle } from "drizzle-orm/neon-http";
import { databaseUrl } from "../../env.config";

export const db = drizzle(databaseUrl);
