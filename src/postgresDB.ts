import { createConnection } from "typeorm";
import { Attendance } from "./entities/attendance";
import { Feedback, QuickFeedback } from "./entities/feedback";

export async function connectPostgres() {
  if (!process.env.POSTGRES_DATABASE_URL) {
      console.log("Attendance db not configured - skipping");
      return;
  }
  const connection = await createConnection({
      name: "default",
      type: "postgres",
      url: process.env.POSTGRES_DATABASE_URL || "postgres://postgres:kidsloop@localhost",
      synchronize: true,
      logging: Boolean(process.env.DATABASE_LOGGING),
      entities: [Attendance, Feedback, QuickFeedback],
  });
  console.log("🐘 Connected to postgres");
  return connection;
}