import path from "path";
import { DataSourceOptions } from "typeorm";
export const connOptions: DataSourceOptions = {
    name: "default",
    type: "postgres",
    url:
    process.env.POSTGRES_DATABASE_URL ||
    "postgres://postgres:kidsloop@localhost",
    synchronize: false,
    logging: Boolean(process.env.DATABASE_LOGGING),
    entities: [path.join(__dirname, "./entities/*.{ts,js}")],
    migrations: [path.join(__dirname, "./migrations/*.{ts,js}")],
    migrationsTableName: "migrations",
    migrationsRun: true,
};
