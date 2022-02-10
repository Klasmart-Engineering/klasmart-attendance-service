import path from "path";
import { ConnectionOptions } from "typeorm";

export const connOptions: ConnectionOptions = {
  name: "default",
  type: "postgres",
  url:
    process.env.POSTGRES_DATABASE_URL ||
    "postgres://postgres:kidsloop@localhost",
  synchronize: false,
  logging: Boolean(process.env.DATABASE_LOGGING),
  entities: [path.join(__dirname, "./entities/*.{ts,js}")],
  migrations: ["src/migrations/*.{ts,js}", "dist/migrations/*.{ts,js}"],
  migrationsTableName: "migrations",
  migrationsRun: true,
  cli: {
    migrationsDir: "src/migrations",
  },
};
