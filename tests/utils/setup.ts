import { connectPostgres } from "./postgresDB";

connectPostgres(true).then(() => process.exit());