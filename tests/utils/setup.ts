import { connectPostgres } from "./postgresDB";

connectPostgres(false).then(() => process.exit());