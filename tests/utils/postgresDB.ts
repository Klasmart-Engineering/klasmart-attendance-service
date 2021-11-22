import { createConnection } from "typeorm";

export const connectPostgres = async (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    url: process.env.POSTGRES_DATABASE_URL || "postgres://postgres:kidsloop@localhost",
    synchronize: drop,
    dropSchema: drop,
    logging: false,
    entities: ["src/entities/*.ts"]
  })};