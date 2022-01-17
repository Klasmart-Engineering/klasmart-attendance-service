import { ConnectionOptions } from "typeorm";
import { Attendance } from "./entities/attendance";
import { Feedback, QuickFeedback } from "./entities/feedback";

const connOptions: ConnectionOptions = {
  name: "default",
  type: "postgres",
  url: process.env.POSTGRES_DATABASE_URL || "postgres://postgres:kidsloop@localhost",
  synchronize: true,
  logging: Boolean(process.env.DATABASE_LOGGING),
  entities: [Attendance, Feedback, QuickFeedback],
  migrations: ["src/migrations/*.ts", "dist/migrations/*.js"],
  cli: {
      "migrationsDir": "migrations"
  }
}
export = connOptions;
