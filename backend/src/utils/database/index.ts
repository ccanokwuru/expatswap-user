import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import { env } from "process";

console.log({ Client });

const connection = new Client({
  host: env.DB_SERVER,
  user: env.DB_USERNAME,
  port: Number(env.DB_PORT),
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});
await connection.connect();
const database = drizzle(connection, { schema });

export { connection, database };
