import * as dotenv from "dotenv"
import "reflect-metadata";
import "module-alias/register";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express"
import { buildSchema } from "type-graphql";
import { AttendancesResolver, FeedbackResolver } from "@src/modules/index";
import { connectPostgres } from "@src/postgresDB";


dotenv.config();

const main = async () => {
  await connectPostgres();
  const schema = await buildSchema({
    resolvers: [AttendancesResolver, FeedbackResolver]
  })
  const server = new ApolloServer({ schema });
  const app = Express();
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on http://localhost:3000/graphql")
  });
}

main();