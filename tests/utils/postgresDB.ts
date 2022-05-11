import { createConnection } from "typeorm";
import path from "path";

export const connectPostgres = async (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    url:
    process.env.POSTGRES_DATABASE_URL ||
    "postgres://postgres:kidsloop@localhost",
    synchronize: drop,
    dropSchema: drop,
    logging: Boolean(process.env.DATABASE_LOGGING),
    entities: [path.join(__dirname, "../../src/entities/*.{ts,js}")],
    migrations: [path.join(__dirname, "../../src/migrations/*.{ts,js}")],
    migrationsTableName: "migrations",
    migrationsRun: true,
    cli: {
        migrationsDir: "src/migrations",
    },
  })};